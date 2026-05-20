import swaggerJSDoc from 'swagger-jsdoc';

import { env } from './env';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Hashers Marketplace API',
      version: '1.0.0',
      description: 'Internal marketplace backend API for HashedIn employees',
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Invalid or expired token',
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);