import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import os from 'os';
import path from 'path';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  const allowedOrigins = env.CLIENT_URL.split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(null, false);
      },
      credentials: true,
    }),
  );
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(
    '/uploads',
    express.static(path.join(os.tmpdir(), 'quantum-uploads'), {
      fallthrough: true,
      maxAge: '7d',
    }),
  );

  app.get('/', (_req, res) => {
    res.json({
      name: 'Quantum Digital Labs API',
      version: '0.1.0',
      docs: '/api/health',
    });
  });

  app.use('/api', apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
