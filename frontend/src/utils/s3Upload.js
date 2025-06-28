import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const initializeS3 = () => {
  const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    console.warn('AWS credentials not found in environment variables. Using mock upload for demo.');
    return null;
  }

  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
};

export const uploadToS3 = async (file, bucketName, onProgress) => {
  const s3 = initializeS3();
  
  if (!s3) {
    return mockUpload(file, onProgress);
  }

  try {
    const fileName = `receipts/${Date.now()}-${file.name}`;
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ContentType: file.type,
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'original-name': file.name
      }
    });

    // Simulate progress for demo (AWS SDK v3 doesn't have built-in progress)
    if (onProgress) {
      const steps = [0, 25, 50, 75, 100];
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 200));
        onProgress(steps[i]);
      }
    }

    const result = await s3.send(command);
    
    return {
      success: true,
      location: `https://${bucketName}.s3.amazonaws.com/${fileName}`,
      bucket: bucketName,
      key: fileName,
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
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const url = await getSignedUrl(s3, command, { expiresIn });
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
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    await s3.send(command);
    
    return { success: true };

  } catch (error) {
    console.error('S3 delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};