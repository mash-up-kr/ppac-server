import path from 'path';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { NextFunction, Response } from 'express';
import heicConvert from 'heic-convert';
import multer from 'multer';
import sharp from 'sharp';

import config from './config';
import { logger } from './logger';
import { s3 } from './s3';
import { CustomRequest } from '../middleware/requestedInfo';

const storage = multer.memoryStorage();
export const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter(_req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      logger.warn('Invalid file type: ' + file.mimetype);
      cb(null, false);
    }
  },
});

export const compressAndUploadImageToS3 = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) return next();

  const { buffer, originalname, mimetype } = req.file;

  let compressedBuffer: Buffer;
  let newMimetype = mimetype;

  // 70% 압축
  try {
    // iPhone (heic, heif -> jpeg)
    if (mimetype === 'image/heic' || mimetype === 'image/heif') {
      const outputBuffer = await heicConvert({
        buffer,
        format: 'JPEG',
        quality: 1,
      });
      compressedBuffer = await sharp(outputBuffer).jpeg({ quality: 70 }).toBuffer();
      newMimetype = 'image/jpeg';
    } else if (mimetype === 'image/png') {
      compressedBuffer = await sharp(buffer).png({ quality: 70 }).toBuffer();
    } else if (mimetype === 'image/webp') {
      compressedBuffer = await sharp(buffer).webp({ quality: 70 }).toBuffer();
    } else if (mimetype === 'image/tiff' || mimetype === 'image/tif') {
      compressedBuffer = await sharp(buffer).tiff({ quality: 70 }).toBuffer();
    } else if (mimetype === 'image/gif') {
      compressedBuffer = await sharp(buffer, { animated: true }).webp({ quality: 70 }).toBuffer();
    } else {
      // Default to jpeg if not png, gif, webp, tiff, heic or heif
      compressedBuffer = await sharp(buffer).jpeg({ quality: 70 }).toBuffer();
    }

    const ext = path.extname(originalname);
    const key = `${Date.now()}${newMimetype === 'image/jpeg' ? '.jpg' : ext}`;

    // Upload the compressed image to S3
    const command = new PutObjectCommand({
      Bucket: config.AWS_BUCKET_NAME,
      Key: key,
      Body: compressedBuffer,
      ACL: 'public-read',
      ContentType: newMimetype,
    });

    await s3.send(command);
    req.file.location = `https://${config.AWS_BUCKET_NAME}.s3.${config.AWS_REGION}.amazonaws.com/${key}`;
    next();
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};
