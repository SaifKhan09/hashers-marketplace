import { env } from './config/env';
import { prisma } from './lib/prisma';
import app from './app';

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

void startServer();