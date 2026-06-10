import './env';
import express from 'express';
import cors from 'cors';

import { webhookRouter } from './routes/webhook';
import { newsRouter } from './routes/news';
import { storesRouter } from './routes/stores';
import { offersRouter } from './routes/offers';
import { writersRouter } from './routes/writers';
import { settingsRouter } from './routes/settings';
import { authRouter } from './routes/auth';

const app = express();

app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Public
app.use('/webhook', webhookRouter);
app.use('/api/auth', authRouter);

// Protected (admin)
app.use('/api/news', newsRouter);
app.use('/api/stores', storesRouter);
app.use('/api/offers', offersRouter);
app.use('/api/writers', writersRouter);
app.use('/api/settings', settingsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`桃園購LINE@ backend running on port ${PORT}`));
