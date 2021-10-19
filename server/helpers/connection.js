import dotenv from 'dotenv';
import { Pool } from 'pg';
import configurations from '../config/config';


dotenv.config();
let config;
const connection = () => {
  if (process.env.NODE_ENV === 'development') {
    config = configurations.development;
  } else if (process.env.NODE_ENV === 'test') {
    config = configurations.test;
  } else {
    config = configurations.production;
  }
  const pool = new Pool(config);

  return pool;
};
export default connection;
