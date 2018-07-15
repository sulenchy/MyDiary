import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import winston from 'winston';

dotenv.config();

const app = express();


const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});


app.listen(port, () => {
  winston.log('info', `App listening at localhost:${port}`);
});

export default app;