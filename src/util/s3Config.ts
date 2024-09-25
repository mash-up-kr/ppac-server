import AWS from 'aws-sdk';

import config from './config';
import { logger } from './logger';
import CustomError from '../errors/CustomError';
import { HttpCode } from '../errors/HttpCode';

const s3 = new AWS.S3({
  accessKeyId: config.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  region: config.AWS_REGION,
});

const uploadToS3 = async (
  fileKey: string,
  fileBuffer: Buffer,
  fileType: string,
): Promise<string> => {
  const params = {
    Bucket: config.AWS_BUCKET_NAME,
    Key: fileKey,
    Body: fileBuffer,
    ContentType: fileType,
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (err) {
    logger.error(`Failed to upload meme`, err.message);
    throw new CustomError(`Failed to upload meme(${err.message})`, HttpCode.INTERNAL_SERVER_ERROR);
  }
};

export { uploadToS3 };
