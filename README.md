# Smart Receipt Analyzer 🧾

> **AWS Lambda Hackathon Project** - Serverless receipt processing with intelligent expense categorization

Transform your receipt management with AI-powered data extraction using AWS Lambda, Textract, and a beautiful React frontend.

![Smart Receipt Analyzer Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Smart+Receipt+Analyzer)

## 🚀 Features

- **📱 Drag & Drop Upload**: Intuitive file upload with support for JPG, PNG, and PDF
- **🤖 AI-Powered OCR**: AWS Textract for accurate data extraction
- **⚡ Serverless Architecture**: AWS Lambda for scalable processing
- **📊 Smart Categorization**: Automatic expense category detection
- **📈 Beautiful Visualizations**: Interactive charts and data displays
- **🎨 Modern UI/UX**: Clean, responsive design built with React
- **☁️ Cloud-Native**: Full AWS integration with S3 and API Gateway

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────────┐
│   React App     │───▶│   S3 Bucket  │───▶│  Lambda Func    │
│   (Frontend)    │    │  (Storage)   │    │  (Processing)   │
└─────────────────┘    └──────────────┘    └─────────────────┘
                                                     │
                                            ┌─────────────────┐
                                            │  AWS Textract  │
                                            │     (OCR)      │
                                            └─────────────────┘
```

## 🛠️ Tech Stack

### Backend
- **AWS Lambda** (Node.js 18.x) - Serverless compute
- **AWS Textract** - OCR and document analysis
- **AWS S3** - File storage and triggers
- **AWS API Gateway** - REST API endpoints
- **CloudFormation/SAM** - Infrastructure as Code

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Dropzone** - File upload component
- **Lucide React** - Beautiful icons
- **Tailwind CSS** - Utility-first styling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- AWS CLI configured with appropriate permissions
- AWS SAM CLI for deployment

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd smart-receipt-analyzer
pnpm install
```

### 2. Deploy AWS Infrastructure

```bash
# Build and deploy the Lambda function
sam build
sam deploy --guided

# Note the outputs: S3 bucket name, API Gateway URL, etc.
```

### 3. Configure Frontend

```bash
cd frontend
cp .env.example .env

# Edit .env with your AWS configuration
# VITE_S3_BUCKET_NAME=your-bucket-name
# VITE_AWS_REGION=us-east-1
# VITE_API_GATEWAY_URL=your-api-url
```

### 4. Run Development Server

```bash
cd frontend
pnpm install
pnpm run dev
```

Visit `http://localhost:3000` to see the app in action!

## 📦 Deployment

### Backend (AWS)

1. **Deploy with SAM:**
   ```bash
   sam build
   sam deploy --stack-name smart-receipt-analyzer --capabilities CAPABILITY_IAM
   ```

2. **Note the CloudFormation outputs:**
   - S3 Bucket Name
   - Lambda Function ARN
   - API Gateway URL

### Frontend (Vercel)

1. **Connect to Vercel:**
   ```bash
   cd frontend
   vercel
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   ```
   VITE_S3_BUCKET_NAME=your-bucket-name
   VITE_AWS_REGION=us-east-1
   VITE_API_GATEWAY_URL=your-api-url
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration

### AWS Permissions

Your Lambda execution role needs these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::your-bucket/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "textract:AnalyzeExpense",
        "textract:AnalyzeDocument"
      ],
      "Resource": "*"
    }
  ]
}
```

### Environment Variables

#### Backend (Lambda)
- `AWS_REGION` - AWS region (automatically set)
- `BUCKET_NAME` - S3 bucket name for receipts

#### Frontend
- `VITE_AWS_REGION` - AWS region
- `VITE_S3_BUCKET_NAME` - S3 bucket name
- `VITE_API_GATEWAY_URL` - API Gateway endpoint
- `VITE_AWS_ACCESS_KEY_ID` - (Optional) For direct S3 upload
- `VITE_AWS_SECRET_ACCESS_KEY` - (Optional) For direct S3 upload

## 📋 Supported File Formats

- **Images**: JPG, JPEG, PNG
- **Documents**: PDF
- **Size Limit**: 10MB per file
- **Best Results**: Clear, well-lit receipts with readable text

## 🎯 Expense Categories

The system automatically categorizes expenses into:

- 🍕 **Food & Dining** - Restaurants, cafes, food delivery
- 🚗 **Transportation** - Uber, Lyft, taxi services
- 🏨 **Travel & Lodging** - Hotels, Airbnb, booking sites
- 📎 **Office Supplies** - Business supplies, stationery
- ⛽ **Fuel** - Gas stations, fuel purchases
- 💰 **Major Purchase** - High-value items ($500+)
- 📦 **General** - Other miscellaneous expenses

## 🧪 Testing

### Backend Testing
```bash
# Run unit tests
npm test

# Test Lambda locally
sam local start-api
```

### Frontend Testing
```bash
cd frontend
pnpm run test
pnpm run test:coverage
```

## 📊 Demo Flow

1. **Upload Receipt** - Drag & drop or click to upload
2. **Processing** - Watch real-time progress indicators
3. **AI Analysis** - AWS Textract extracts structured data
4. **Smart Categorization** - Automatic expense classification
5. **Visual Results** - Interactive charts and detailed breakdown
6. **Export Ready** - JSON data perfect for accounting systems

## 🔍 API Reference

### Lambda Function Response Format

```json
{
  "statusCode": 200,
  "body": {
    "success": true,
    "data": {
      "merchant": "STARBUCKS COFFEE",
      "total": 12.45,
      "date": "2024-06-24",
      "category": "Food & Dining",
      "items": [
        {
          "name": "GRANDE LATTE",
          "price": 5.95
        }
      ],
      "confidence": 92
    },
    "file": {
      "bucket": "receipt-bucket",
      "key": "receipts/receipt.jpg",
      "size": 245760
    },
    "timestamp": "2024-06-24T10:30:00.000Z"
  }
}
```

## 🚨 Troubleshooting

### Common Issues

**1. Lambda Function Timeout**
```yaml
# Increase timeout in template.yaml
Timeout: 60  # seconds
MemorySize: 512  # MB
```

**2. S3 Permissions Error**
- Ensure Lambda has S3:GetObject permissions
- Check bucket policy allows Lambda access

**3. Textract API Limits**
- Monitor usage in AWS Console
- Implement retry logic for rate limiting

**4. Frontend CORS Issues**
- Verify API Gateway CORS configuration
- Check S3 bucket CORS settings

### Performance Optimization

```javascript
// Lambda memory recommendations
const memoryConfigs = {
  'small-receipts': 256,    // < 1MB files
  'medium-receipts': 512,   // 1-5MB files  
  'large-receipts': 1024    // > 5MB files
};
```

## 🏆 Hackathon Criteria Checklist

- ✅ **Real-world Problem**: Automates expense management
- ✅ **AWS Lambda Integration**: Serverless receipt processing
- ✅ **Scalable Architecture**: Event-driven S3 triggers
- ✅ **Modern UI/UX**: Beautiful, responsive design
- ✅ **Demo Ready**: Complete upload → process → results flow
- ✅ **Production Ready**: Error handling, logging, monitoring

## 📸 Video Demo Script

1. **Introduction** (0:00-0:15)
   - "Smart Receipt Analyzer - AWS Lambda hackathon project"
   - Show homepage with clean UI

2. **Upload Demo** (0:15-0:30)
   - Drag and drop a receipt
   - Show real-time progress indicators

3. **Processing** (0:30-0:45)
   - Explain S3 trigger → Lambda → Textract flow
   - Show processing steps

4. **Results** (0:45-1:00)
   - Display extracted data with visualizations
   - Highlight accuracy and categorization

5. **Conclusion** (1:00-1:15)
   - Summarize benefits for businesses
   - Show architecture diagram

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AWS for providing amazing serverless services
- The React community for excellent tooling
- Hackathon organizers for the opportunity to build something awesome

---

**Built with ❤️ for the AWS Lambda Hackathon**

*Transform your expense management today!* 🚀