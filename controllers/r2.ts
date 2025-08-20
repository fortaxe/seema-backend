import pkg from 'aws-sdk'; 
const { S3 } = pkg;

// Configure R2
const configureR2 = () => {
  return new S3({
    endpoint: process.env.END_POINT,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: 'auto',
    s3ForcePathStyle: true, // This is crucial for R2 compatibility
  });
};

export const generatePresignedUrl = async (req, res) => {

  const { contentType, keyPrefix } = req.body;
  
  if (!contentType) {
    return res.status(400).json({ message: 'contentType is required' });
  }
  
  try {
    const r2 = configureR2();
    const bucketName = process.env.BUCKET_NAME;
    
    // Create a unique file name to prevent overwriting
    const fileName = `file-${Date.now()}`;
    const key = keyPrefix ? `${keyPrefix}${fileName}` : `uploads/${fileName}`;
    
    const params = {
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      Expires: 300 // URL expires in 5 minutes
    };
    
    const uploadUrl = r2.getSignedUrl('putObject', params);
    
    res.status(200).json({
      url: uploadUrl,
      publicUrl: `${process.env.PUBLIC_URL}/${key}`
    });
  } catch (err) {
    console.error('Error generating presigned URL:', err.message);
    res.status(500).json({ message: err.message });
  }
};

