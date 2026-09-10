import { Router } from 'express';
import { isDatabaseConnected } from '../db/pool';
import { isDatabaseConfigured, isSmtpConfigured } from '../config/env';

const router = Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    ok: true,
    service: 'quantum-digital-labs-api',
    database: {
      configured: isDatabaseConfigured,
      connected: isDatabaseConnected(),
    },
    smtp: {
      configured: isSmtpConfigured,
    },
  });
});

export default router;
