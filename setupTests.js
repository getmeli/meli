/*
 TODO workaround for https://github.com/facebook/jest/issues/2441
  https://github.com/facebook/jest/issues/3853#issuecomment-317117151
 */

const os = require('os');

/*
 * Force chalk to use colors, so we always have them in logs
 * https://github.com/chalk/chalk#chalksupportscolor
 */
process.env['FORCE_COLOR'] = '1';

// env
process.env.MELI_URL = 'http://localhost:3001';
process.env.MELI_MAIL_HOST = 'localhost';
process.env.MELI_MAIL_PORT = '1025';
process.env.MELI_BILLING_PRICE_ID = 'price_123';
process.env.MELI_BILLING_FREE_REQUESTS = '8000';
process.env.MELI_BILLING_PRICE_PER_REQUEST = '0.00001';
process.env.MELI_STRIPE_SECRET_KEY = 'secret';
process.env.MELI_STRIPE_WEBHOOK_SECRET = 'secret';
process.env.MELI_JWT_SECRET = 'jwtSecret';
process.env.MELI_MONGO_URI = 'mongodb://mocked:27017/mocked';
process.env.MELI_USER = 'user';
process.env.MELI_PASSWORD = 'password';
process.env.MELI_STORAGE_DIR = os.tmpdir();
