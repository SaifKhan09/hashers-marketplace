Hashers Marketplace API
A production-style backend API for a marketplace platform built with Node.js, Express, Prisma ORM, and PostgreSQL. The project includes Swagger/OpenAPI documentation, structured logging with Winston, authentication and role-based authorization, and a growing automated test suite with more than 80% overall line coverage.

Tech Stack
Node.js

Express.js

TypeScript

Prisma ORM

PostgreSQL

Swagger / OpenAPI

Winston

Jest

Supertest

Features
User authentication

Sign up

Sign in

Sign out

Get current authenticated user

Role-based authorization

Item management

Create item

List items

Get item by ID

Update item

Delete item

Booking management

Create booking

Get buyer bookings

Get seller bookings

Update booking status

Transaction management

Complete transaction

Get purchase history

Get sales history

Admin transaction access

Swagger API documentation

Request and error logging with Winston

Centralized error handling

Unit tests for services, controllers, routes, middleware, and utilities

Project Structure
bash
src/
├── config/
│   ├── env.ts
│   └── swagger.ts
├── lib/
│   ├── logger.ts
│   └── prisma.ts
├── middlewares/
├── modules/
│   ├── admin/
│   ├── auth/
│   ├── bookings/
│   ├── items/
│   └── transactions/
├── routes/
└── utils/
Prerequisites
Make sure the following are installed:

Node.js 18+

PostgreSQL

npm

Environment Variables
Create a .env file in the root of the project.

Example:

text
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/hashers_marketplace"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
Update the values according to your local machine and database setup.

Installation
bash
git clone <your-repository-url>
cd hashers-marketplace-api
npm install
Prisma Setup
Generate the Prisma client and run migrations:

bash
npx prisma generate
npx prisma migrate dev --name init
If needed, open Prisma Studio:

bash
npx prisma studio
Run the Project
Development
bash
npm run dev
Production build
bash
npm run build
npm start
API Documentation
Swagger documentation is available after the server starts.

Example route:

bash
http://localhost:5000/api-docs
Scripts
bash
npm run dev
npm run build
npm start
npm test
npm run test:coverage
Testing
The project includes tests for:

Services

Controllers

Routes

Middleware

Utility functions

Run tests:

bash
npm test
Run coverage:

bash
npm run test:coverage
Current testing status at the latest milestone:

22 test suites passing

95 tests passing

80%+ overall line coverage

Authentication
Protected routes use Bearer token authentication.

Example header:

text
Authorization: Bearer <jwt_token>
Logging
Winston is used for:

Request logging

Error logging

Structured console output

Design Notes
This project follows a modular architecture where each domain is organized into its own module with dedicated route, controller, service, and test files. Business logic is kept in services, controllers handle request and response flow, and middleware is used for authentication, authorization, request logging, not-found handling, and centralized error handling.

Suggested Commit Flow
The project was intended to be built gradually using feature-based commits. A recommended progression is:

Initial Express and TypeScript setup

Prisma and PostgreSQL configuration

Auth module

Item module

Booking module

Transaction module

Swagger documentation

Winston logging

Middleware and error handling polish

Unit testing and coverage improvements

Future Improvements
Add integration tests for full API flows

Improve admin module coverage

Add Docker support

Add request validation with Zod or Joi

Add refresh token strategy

Add CI pipeline for automated testing

Author Notes
This README reflects the final structured state of the project after implementing feature modules, testing improvements, and coverage enhancements.