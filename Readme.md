<div align="center">

# Hashers Marketplace API

A production-style backend API for a marketplace platform built with Node.js, Express, Prisma ORM, and PostgreSQL.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

</div>

Structured logging with Winston, Swagger/OpenAPI documentation, authentication and role-based authorization, and a growing automated test suite with more than 80% overall line coverage.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Prisma Setup](#prisma-setup)
- [Run the Project](#run-the-project)
- [API Documentation](#api-documentation)
- [Scripts](#scripts)
- [Testing](#testing)
- [Authentication](#authentication)
- [Logging](#logging)
- [Design Notes](#design-notes)
- [Suggested Commit Flow](#suggested-commit-flow)
- [Future Improvements](#future-improvements)
- [Author Notes](#author-notes)

## Tech Stack

| Category | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| ORM | Prisma ORM |
| Database | PostgreSQL |
| API Docs | Swagger / OpenAPI |
| Logging | Winston |
| Testing | Jest, Supertest |

## Features

### Authentication
- Sign up
- Sign in
- Sign out
- Get current authenticated user
- Role-based authorization

### Item Management
- Create item
- List items
- Get item by ID
- Update item
- Delete item

### Booking Management
- Create booking
- Get buyer bookings
- Get seller bookings
- Update booking status

### Transaction Management
- Complete transaction
- Get purchase history
- Get sales history
- Admin transaction access

### Additional Capabilities
- Swagger API documentation
- Request and error logging with Winston
- Centralized error handling
- Unit tests for services, controllers, routes, middleware, and utilities

## Project Structure

```bash
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
```

## Prerequisites

Make sure the following are installed:

- Node.js 18+
- PostgreSQL
- npm

## Environment Variables

Create a `.env` file in the root of the project.

> [!IMPORTANT]
> Update the values according to your local machine and database setup.

Example:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:password@localhost:5432/hashers_marketplace"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

## Installation

```bash
git clone <your-repository-url>
cd hashers-marketplace-api
npm install
```

## Prisma Setup

Generate the Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

If needed, open Prisma Studio:

```bash
npx prisma studio
```

## Run the Project

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## API Documentation

Swagger documentation is available after the server starts.

```bash
http://localhost:5000/api-docs
```

> [!NOTE]
> If a POST or PATCH endpoint does not show a request body in Swagger UI, ensure that the route has a proper OpenAPI 3 `requestBody` definition in its Swagger JSDoc block.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build TypeScript project |
| `npm start` | Start production build |
| `npm test` | Run test suite |
| `npm run test:coverage` | Run tests with coverage report |

## Testing

The project includes tests for:

- Services
- Controllers
- Routes
- Middleware
- Utility functions

Run tests:

```bash
npm test
```

Run coverage:

```bash
npm run test:coverage
```

Current testing status at the latest milestone:

- 22 test suites passing
- 95 tests passing
- 80%+ overall line coverage

## Authentication

Protected routes use Bearer token authentication.

Example header:

```http
Authorization: Bearer <jwt_token>
```

## Logging

Winston is used for:

- Request logging
- Error logging
- Structured console output

## Design Notes

This project follows a modular architecture where each domain is organized into its own module with dedicated route, controller, service, and test files. Business logic is kept in services, controllers handle request and response flow, and middleware is used for authentication, authorization, request logging, not-found handling, and centralized error handling.

## Suggested Commit Flow

The project was intended to be built gradually using feature-based commits. A recommended progression is:

1. Initial Express and TypeScript setup
2. Prisma and PostgreSQL configuration
3. Auth module
4. Item module
5. Booking module
6. Transaction module
7. Swagger documentation
8. Winston logging
9. Middleware and error handling polish
10. Unit testing and coverage improvements

## Future Improvements

- Add integration tests for full API flows
- Improve admin module coverage
- Add Docker support
- Add request validation with Zod or Joi
- Add refresh token strategy
- Add CI pipeline for automated testing

## Author Notes

This README reflects the final structured state of the project after implementing feature modules, testing improvements, and coverage enhancements.
