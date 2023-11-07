import express from 'express';
import dotenv from 'dotenv';
import db from './config/Database.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.static('public'));

(async () => {
  await db.sequelize.sync();
})();

app.listen(5000, () => console.log('Server Running Up ....'));
