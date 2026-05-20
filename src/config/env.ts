import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['PORT', 'NODE_ENV', 'DATABASE_URL'] as const;

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

export const env = {
  port: Number(process.env.PORT) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL as string,
};