import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../.env.test'),
});

if (process.env.NODE_ENV !== 'test') {
  throw new Error('Tests deben correr en entorno TEST');
}