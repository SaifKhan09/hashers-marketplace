import swaggerJSDoc from 'swagger-jsdoc';

import { env } from './env';

const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Hashers Marketplace API',
      version: '1.0.0',
      description:
        'Marketplace backend API built with Express, Prisma ORM, PostgreSQL, Swagger, and Winston logging.',
    },
    servers: [
      {
        url: `http://localhost:${env.port}/api`,
        description: 'Development server',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Authentication APIs' },
      { name: 'Items', description: 'Item management APIs' },
      { name: 'Bookings', description: 'Booking management APIs' },
      { name: 'Transactions', description: 'Transaction management APIs' },
      { name: 'Admin', description: 'Administrative APIs' },
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
            details: {
              nullable: true,
              example: null,
            },
          },
        },
        UnauthorizedErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Unauthorized',
            },
          },
        },
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);