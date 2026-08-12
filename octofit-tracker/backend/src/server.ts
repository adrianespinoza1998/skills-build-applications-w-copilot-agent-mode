import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import './config/database';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'octofit-backend' });
});

app.listen(port, () => {
  console.log(`Octofit backend running on http://localhost:${port}`);
});
