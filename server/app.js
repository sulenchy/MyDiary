import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import winston from 'winston';
import entriesRouter from './routes/entries.route';
import entriesController from './controllers/entries.controller';

dotenv.config();

const app = express();

// parse application/x-www-form-urlencoded

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

app.use(logger('dev'));

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));

app.use(logger('dev'));

// app.use('/api/v1', entriesRouter);

app.get('/me', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/v1/entries', entriesController.getAllEntries);

app.get('/api/v1/entries/:id', entriesController.getDiaryEntryById);


app.listen(port, () => {
  winston.log('info', `App listening at localhost:${port}`);
});

export default app;
