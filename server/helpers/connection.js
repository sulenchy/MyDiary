import dotenv from 'dotenv';
import { Client } from 'pg';
import configurations from '../config/config';


dotenv.config();
let config;
const connection = () => {
  if (process.env.NODE_ENV === 'development') {
    config = configurations.development;
  } else if (process.env.NODE_ENV === 'test') {
    config = configurations.test;
  } else { config = process.env.DATABASE_URL; }
  const client = new Client(config);
  return client;
};
export default connection;
