import type { IncomingMessage, ServerResponse } from 'http';
import { createApp } from '../src/app';
import { connectDatabase } from '../src/db/pool';

export const config = {
  api: {
    bodyParser: false,
  },
};

const app = createApp();

let ready: Promise<void> | null = null;

function ensureReady(): Promise<void> {
  if (!ready) {
    ready = connectDatabase();
  }
  return ready;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  await ensureReady();
  return app(req, res);
}
