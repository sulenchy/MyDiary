import dotenv from 'dotenv';
import { Client } from 'pg';
import { winston } from 'winston';
import configurations from '../config/config';
import queries from './database';

dotenv.config();
let config;
if (process.env.NODE_ENV === 'development') {
  config = configurations.development;
} else if (process.env.NODE_ENV === 'test') {
  config = configurations.test;
} else { config = process.env.DATABASE_URL; }

const client = new Client(config);
client.connect();
client.query(queries, (error) => {
  winston.log('error', error);
  client.end();
});
