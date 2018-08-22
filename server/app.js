import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import entriesRouter from './routes/index';

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));

const port = process.env.PORT || 3000;

app.use(logger('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', entriesRouter);

app.use('/client', express.static('public'));

app.listen(port, () => {
  winston.log('info', `App listening at localhost:${port}`);
});

export default app;
