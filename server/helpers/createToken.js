import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secret = process.env.JWT_SECRET;
const lifeSpan = 60 * 60 * 24;

const createToken = id => jwt.sign({ data: id }, secret, { expiresIn: lifeSpan });

export default createToken;
