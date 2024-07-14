import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'development';

if (env === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}
