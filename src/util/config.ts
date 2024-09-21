import dotenv from 'dotenv';

dotenv.config();

// DB
const DB_URL = process.env.DB_URL;

// APP
const PORT = process.env.PORT;

// AWS
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// FIREBASE
const FCM_PROJECT_ID = process.env.FCM_PROJECT_ID;
const FCM_PRIVATE_KEY = process.env.FCM_PRIVATE_KEY;
const FCM_CLIENT_EMAIL = process.env.FCM_CLIENT_EMAIL;

const ENV = process.env.NODE_ENV;

export default {
  ENV,
  DB_URL,
  PORT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
  FCM_CLIENT_EMAIL,
  FCM_PRIVATE_KEY,
  FCM_PROJECT_ID,
};
