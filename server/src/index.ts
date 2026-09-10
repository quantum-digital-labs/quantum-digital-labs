import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './db/pool';
import { verifySmtpConnection } from './utils/mail';

async function bootstrap() {
  await connectDatabase();
  await verifySmtpConnection();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(
      `[server] Quantum Digital Labs API listening on http://localhost:${env.PORT}`,
    );
    console.log(`[server] Health check: http://localhost:${env.PORT}/api/health`);
  });

  const shutdown = async (signal: string) => {
    console.log(`[server] ${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch((error) => {
  console.error('[server] Failed to start', error);
  process.exit(1);
});
