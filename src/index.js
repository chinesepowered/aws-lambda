const { TextractClient, AnalyzeExpenseCommand } = require('@aws-sdk/client-textract');

const textract = new TextractClient({ region: process.env.AWS_REGION || 'us-east-1' });

const categorizeExpense = (merchantName, amount) => {
  const merchant = merchantName.toLowerCase();
  
  if (merchant.includes('uber') || merchant.includes('lyft') || merchant.includes('taxi')) {
    return 'Transportation';
  }
  if (merchant.includes('restaurant') || merchant.includes('cafe') || merchant.includes('food') || 
      merchant.includes('pizza') || merchant.includes('burger') || merchant.includes('starbucks')) {
    return 'Food & Dining';
  }
  if (merchant.includes('hotel') || merchant.includes('airbnb') || merchant.includes('booking')) {
    return 'Travel & Lodging';
  }
  if (merchant.includes('office') || merchant.includes('supplies') || merchant.includes('staples')) {
    return 'Office Supplies';
  }
  if (merchant.includes('gas') || merchant.includes('fuel') || merchant.includes('shell') || 
      merchant.includes('exxon') || merchant.includes('bp')) {
    return 'Fuel';
  }
  if (amount > 500) {
    return 'Major Purchase';
  }
  
  return 'General';
};

const extractReceiptData = async (s3Object) => {
  try {
    const params = {
      Document: {
        S3Object: {
          Bucket: s3Object.bucket.name,
          Name: decodeURIComponent(s3Object.object.key.replace(/\+/g, ' '))
        }
      }
    };

    console.log('Processing receipt with Textract:', params);
    
    const command = new AnalyzeExpenseCommand(params);
    const response = await textract.send(command);
    
    if (!response.ExpenseDocuments || response.ExpenseDocuments.length === 0) {
      throw new Error('No expense data found in document');
    }

    const expenseDoc = response.ExpenseDocuments[0];
    const summaryFields = expenseDoc.SummaryFields || [];
    const lineItems = expenseDoc.LineItemGroups || [];

    let totalAmount = 0;
    let merchantName = '';
    let date = '';
    let items = [];

    summaryFields.forEach(field => {
      if (field.Type && field.ValueDetection) {
        const fieldType = field.Type.Text;
        const value = field.ValueDetection.Text;
        
        switch (fieldType) {
          case 'TOTAL':
            totalAmount = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
            break;
          case 'VENDOR_NAME':
            merchantName = value;
            break;
          case 'INVOICE_RECEIPT_DATE':
            date = value;
            break;
        }
      }
    });

    lineItems.forEach(group => {
      if (group.LineItems) {
        group.LineItems.forEach(item => {
          if (item.LineItemExpenseFields) {
            let itemName = '';
            let itemPrice = 0;
            
            item.LineItemExpenseFields.forEach(field => {
              if (field.Type && field.ValueDetection) {
                const fieldType = field.Type.Text;
                const value = field.ValueDetection.Text;
                
                if (fieldType === 'ITEM') {
                  itemName = value;
                } else if (fieldType === 'PRICE') {
                  itemPrice = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
                }
              }
            });
            
            if (itemName) {
              items.push({
                name: itemName,
                price: itemPrice
              });
            }
          }
        });
      }
    });

    const category = categorizeExpense(merchantName, totalAmount);

    return {
      success: true,
      data: {
        merchant: merchantName,
        total: totalAmount,
        date: date,
        category: category,
        items: items,
        confidence: expenseDoc.SummaryFields ? 
          Math.round(expenseDoc.SummaryFields.reduce((acc, field) => 
            acc + (field.ValueDetection?.Confidence || 0), 0) / expenseDoc.SummaryFields.length) : 0,
        rawTextractResponse: response
      }
    };
    
  } catch (error) {
    console.error('Error processing receipt:', error);
    return {
      success: false,
      error: error.message,
      details: error.stack
    };
  }
};

exports.handler = async (event) => {
  console.log('Lambda function triggered:', JSON.stringify(event, null, 2));
  
  try {
    if (!event.Records || !event.Records[0] || !event.Records[0].s3) {
      throw new Error('Invalid S3 event structure');
    }

    const s3Event = event.Records[0].s3;
    const bucketName = s3Event.bucket.name;
    const objectKey = decodeURIComponent(s3Event.object.key.replace(/\+/g, ' '));
    
    console.log(`Processing file: ${objectKey} from bucket: ${bucketName}`);
    
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.pdf'];
    const fileExtension = objectKey.toLowerCase().substring(objectKey.lastIndexOf('.'));
    
    if (!supportedFormats.includes(fileExtension)) {
      throw new Error(`Unsupported file format: ${fileExtension}. Supported formats: ${supportedFormats.join(', ')}`);
    }

    const result = await extractReceiptData(s3Event);
    
    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({
        message: 'Receipt processed successfully',
        file: {
          bucket: bucketName,
          key: objectKey,
          size: s3Event.object.size
        },
        timestamp: new Date().toISOString(),
        ...result
      })
    };

    console.log('Lambda response:', JSON.stringify(response, null, 2));
    return response;
    
  } catch (error) {
    console.error('Lambda function error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'Error processing receipt',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};