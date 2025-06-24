import AWS from 'aws-sdk';

const initializeS3 = () => {
  const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    console.warn('AWS credentials not found in environment variables. Using mock upload for demo.');
    return null;
  }

  AWS.config.update({
    region,
    accessKeyId,
    secretAccessKey
  });

  return new AWS.S3();
};

export const uploadToS3 = async (file, bucketName, onProgress) => {
  const s3 = initializeS3();
  
  if (!s3) {
    return mockUpload(file, onProgress);
  }

  try {
    const fileName = `receipts/${Date.now()}-${file.name}`;
    
    const params = {
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'original-name': file.name
      }
    };

    const upload = s3.upload(params);
    
    upload.on('httpUploadProgress', (evt) => {
      const progress = Math.round((evt.loaded / evt.total) * 100);
      if (onProgress) {
        onProgress(progress);
      }
    });

    const result = await upload.promise();
    
    return {
      success: true,
      location: result.Location,
      bucket: result.Bucket,
      key: result.Key,
      etag: result.ETag
    };

  } catch (error) {
    console.error('S3 upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const mockUpload = async (file, onProgress) => {
  console.log('Using mock upload for demo purposes');
  
  const steps = [0, 25, 50, 75, 100];
  
  for (let i = 0; i < steps.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (onProgress) {
      onProgress(steps[i]);
    }
  }

  return {
    success: true,
    location: `https://mock-bucket.s3.amazonaws.com/receipts/${Date.now()}-${file.name}`,
    bucket: 'mock-bucket',
    key: `receipts/${Date.now()}-${file.name}`,
    etag: '"mock-etag-12345"',
    mock: true
  };
};

export const generatePresignedUrl = async (bucketName, key, expiresIn = 3600) => {
  const s3 = initializeS3();
  
  if (!s3) {
    return `https://mock-bucket.s3.amazonaws.com/${key}?mock=true`;
  }

  try {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expiresIn
    };

    const url = await s3.getSignedUrlPromise('getObject', params);
    return url;

  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return null;
  }
};

export const deleteFromS3 = async (bucketName, key) => {
  const s3 = initializeS3();
  
  if (!s3) {
    console.log('Mock delete operation');
    return { success: true, mock: true };
  }

  try {
    const params = {
      Bucket: bucketName,
      Key: key
    };

    await s3.deleteObject(params).promise();
    
    return { success: true };

  } catch (error) {
    console.error('S3 delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};