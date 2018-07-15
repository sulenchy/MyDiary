import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.send('Hello World!!!');
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
