# Phase 4 Backend API

This project is part of the Zero-to-Mastery Software Engineer roadmap.

It is a small Express backend API for practicing backend fundamentals:

- Node.js
- npm scripts
- Express routing
- Middleware
- Request validation
- Error handling
- Environment variables
- API testing
- In-memory data storage
- Project structure

## Current Status

Phase 4 backend foundation is complete through Milestone 137.

Current test status:

```txt
78 tests passing
```

## Tech Stack

- Node.js
- Express
- Node's built-in test runner
- Supertest
- npm

## Project Structure

```json

src/
  app.js
  server.js
  controllers/
    bookController.js
  data/
    bookStore.js
  documentation/
    api_reference.md
  middleware/
    errorHandler.js
    notFoundHandler.js
    requestLogger.js
    bookValidation.js
  routes/
    bookRoutes.js

test/
  app.test.js
  errorMiddleware.test.js
  requestLogger.test.js
  setup/
    setTestEnv.js
  bookStore.test.js

```

### File Responsibilities

`src/server.js`

Start the HTTP server.

`src/app.js`

Creates and configures the Express application.

`src/routes/bookRoutes.js`

Defines book endpoint paths, HTTP methods, and middleware order.

`src/controllers/bookController.js`

Handles book HTTP operations and responses.

`src/data/bookStore.js`

Owns the temporary in-memory book data and data operations.

`src/middleware/bookValidation.js`

Validates route params, query strings, and request bodies.

`src/middleware/requestLogger.js`

Logs requests during development and stays quiet during tests.

`src/middleware/notFoundHandler.js`

Returns JSON `404` responses for unmatched routes.

`src/middleware/errorHandler.js`

Returns JSON error responses for malformed JSON and unexpected failures.

### Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```bash
cp .env.example .env
```

Example `.env`:

```env
PORT=4000
```

### Scripts

Start the server with the environment already provided:

```bash
npm start
```

Start the server in local development mode using `.env`:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

### Local URLs

if `.env` contains `PORT=4000`:

```bash
http://localhost:4000
```

Fallback port when no `PORT` is provided:

```
http://localhost:3000
```

### API Reference

See:

```
documentation/API_REFERENCE.md
```

The API reference documents:

- General routes
- Task routes
- Query parameters
- Request bodies
- Success responses
- Validation errors
- Unknown-route behavior
- Current storage behavior

### Current API Features

- `GET /`
- `GET /health`
- `GET /api/info`
- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books`
- `PATCH /api/books/:id`
- `DELETE /api/books/:id`

Task collection support:

- Filter by completion status
- Search by title
- Sort by ID or title
- Sort ascending or descending
- Paginate with page and limit
- Return pagination metadata

### Testing

The test suit covers:

- General routes
- Task CRUD behavior
- Query validation
- Body validation
- Route-parameter validation
- Uknown routes
- Malformed JSON
- In-memory store behavior
- Middleware behavior
- Test environment setup
  Run:

```bash
npm test
```

Expected:

```bash
78 tests passing
```

### Test coverage

Run the test suite with Node's built-in coverage reporting:

```bash
npm run test:coverage
```

Run all local quality checks:

```bash
npm run check
```

### Coverage thresholds

Run tests and enforce the project's minimum line, branch, and function
coverage requirements:

`test-coverage-lines`: 95

`test-coverage-branches`: 95

`test-coverage-functions`: 90

```bash
npm run test:coverage:check
```

### Storage

This project currently uses an in-memory book store.

That means:

- Data resets when the Node process restarts.
- Data is not persisted to a database yet.
- Task IDs are generated in memory.
- The store returns copies to protect internal state.

Persistent database storage will be added later.

### Learning Focus

This project is intentionally incremental.

Current focus:

- Backend fundamentals
- Clean request/response flow
- Validation before mutation
- Predictable error responses
- Testable module boundaries
- Clear project organization

Advanced backend architecture, authentication, database persistence, and deployment are intentionally saved for later milestones.

```

```
