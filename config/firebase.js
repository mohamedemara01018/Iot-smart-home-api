const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
    const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8');
    return JSON.parse(json);
  }

  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // cwd() => current working directory
    // resolve -> join two paths
    const serviceAccountPath = path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    return require(serviceAccountPath);
  }

  return null;
}

const serviceAccount = getServiceAccount();


if (!admin.apps.length) {
  if (!process.env.FIREBASE_DATABASE_URL) {
    throw new Error('FIREBASE_DATABASE_URL is required in the .env file');
  }

  const appConfig = {
    databaseURL: process.env.FIREBASE_DATABASE_URL
  };

  // Prefer explicit service credentials, but allow Google application default credentials.
  if (serviceAccount) {
    appConfig.credential = admin.credential.cert(serviceAccount);
  } else {
    appConfig.credential = admin.credential.applicationDefault();
  }

  admin.initializeApp(appConfig);
}

const database = admin.database();
console.log('database', database)

module.exports = database;
