import { Server } from 'http';

import { env } from './config/env';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';
import app from './app';

let server: Server;

const shutdown = async (signal: string): Promise<void> => {
  logger.warn(`Received ${signal}. Shutting down gracefully...`);

  try {
    if (server) {
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('HTTP server closed and Prisma disconnected');
        process.exit(0);
      });
    } else {
      await prisma.$disconnect();
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error during shutdown', {
      error: error instanceof Error ? error.stack : error,
    });
    process.exit(1);
  }
};

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();

    server = app.listen(env.port, () => {
      logger.info(`Server running on http://localhost:${env.port}`, {
        environment: env.nodeEnv,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.stack : error,
    });
    process.exit(1);
  }
};

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

void startServer();