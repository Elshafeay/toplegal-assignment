import { DynamoDB } from 'aws-sdk';
const dbPort = process.env.NODE_ENV === 'test'? 8800: 8000;

const config = {
  region: 'localhost',
  endpoint: `http://localhost:${dbPort}`,
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET',
};

export const documentClient = new DynamoDB.DocumentClient(config);
