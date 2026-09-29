# LazyVacay

LazyVacay is a full-stack hotel booking app with a Harry Potter-inspired theme. Guests can browse hotels and rooms, make reservations, and manage their profiles. Administrators can manage hotels, rooms, and reservations.


## Features

- User registration, login, JWT authentication, and profile management
- Hotel and room browsing, including availability by date
- Booking with date validation, capacity checks, and price calculation including VAT
- Reservation history and cancellation
- Admin management for hotels, rooms, and reservations
- Soft deletion for hotels and rooms
- Input validation, rate limiting, Helmet, CORS, and structured API errors

## Tech stack

| Area | Technology |
| --- | --- |
| Client | React, Vite, React Router, styled-components |
| Server | Node.js, Express |
| Database | PostgreSQL with Prisma ORM |
| Authentication | JWT and bcrypt |
| Testing | Vitest and Supertest |


## Run locally

### Prerequisites

- Node.js and npm
- A PostgreSQL database

### Server

Open a terminal:

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Open `server/.env` and add your own database URLs and JWT secret:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="choose-a-long-random-secret"
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
```

Then run:

```powershell
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The API runs on `http://localhost:8000`.

### Client

Open another terminal:

```powershell
cd client
npm install
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

## Tests

The server tests use a separate PostgreSQL database named `lazyvacay_test`.

```powershell
cd server
Copy-Item .env.test.example .env.test
```

Set the two database URLs in `server/.env.test` to your separate test database, then run:

```powershell
npm test
```

Other commands:

```powershell
npm run test:unit
npm run test:db
```

`test:unit` runs tests without database access. `test:db` runs tests against `lazyvacay_test`.

## Validation

```powershell
cd client
npm run lint
npm run build
```

## Environment files

Do not commit `.env` or `.env.test`. The repository only includes safe example files with placeholders.

## Portfolio note

The hotels, rooms, illustrations, and images are part of the fictional LazyVacay world. The live development database is not included in this repository.