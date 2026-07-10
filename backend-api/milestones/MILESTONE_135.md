# Milestone 135 — Backend Phase 4 Review Checkpoint

## Completed

- Reviewed the current backend project structure
- Confirmed the Express app/server split
- Confirmed task routes were isolated in an Express Router
- Confirmed task controllers handled HTTP task operations
- Confirmed task store owned in-memory data behavior
- Confirmed middleware handled validation, logging, not-found, and errors
- Confirmed automated tests covered API behavior
- Confirmed automated tests covered store behavior
- Confirmed automated tests covered middleware behavior
- Confirmed eighty-three tests passed

## Current Project Structure

src/
app.js
server.js
controllers/
taskController.js
data/
taskStore.js
middleware/
errorHandler.js
notFoundHandler.js
requestLogger.js
taskValidation.js
routes/
taskRoutes.js

test/
app.test.js
errorMiddleware.test.js
requestLogger.test.js
setup/
setTestEnv.js
taskStore.test.js

## File Responsibilities

### src/server.js

- Imports the configured Express app
- Reads the port from environment configuration
- Starts the HTTP listener

### src/app.js

- Creates the Express app
- Registers JSON parsing middleware
- Registers request logging middleware
- Defines general routes
- Mounts task routes
- Registers unknown-route middleware
- Registers centralized error middleware
- Exports the app for testing and server startup

### src/routes/taskRoutes.js

- Defines task endpoint paths
- Defines HTTP methods
- Defines middleware order
- Connects routes to controller functions

### src/controllers/taskController.js

- Reads trusted request values prepared by middleware
- Calls task-store functions
- Applies collection filtering, sorting, and pagination
- Sends task success responses
- Sends task missing-resource responses through lookup middleware

### src/data/taskStore.js

- Owns the in-memory task collection
- Owns task ID generation
- Creates task records
- Reads task records
- Updates task records
- Deletes task records
- Resets task records for tests
- Returns copies to protect internal state

### src/middleware/taskValidation.js

- Validates task route IDs
- Validates create-task request bodies
- Validates update-task request bodies
- Validates collection query strings
- Normalizes trusted request values

### src/middleware/requestLogger.js

- Logs request method and URL during development
- Suppresses request logs during tests
- Always calls next()

### src/middleware/notFoundHandler.js

- Returns JSON 404 responses for unmatched routes

### src/middleware/errorHandler.js

- Logs internal errors
- Returns JSON 400 responses for malformed JSON
- Returns safe JSON 500 responses for unexpected errors
- Forwards errors when response headers have already been sent

## API Behavior Covered

- GET /
- GET /health
- GET /api/info
- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PATCH /api/tasks/:id
- DELETE /api/tasks/:id
- Unknown routes
- Unsupported methods
- Malformed JSON request bodies
- Missing and non-JSON request bodies

## Task Collection Features Covered

- Filtering by completed status
- Searching task titles
- Sorting by ID
- Sorting by title
- Ascending sort order
- Descending sort order
- Pagination with page and limit
- Pagination metadata
- Validation for invalid query values
- Validation for repeated query values
- Non-mutating filtering, sorting, and pagination

## Test Coverage Summary

- API route tests
- Query validation tests
- Body validation tests
- Route-parameter validation tests
- Store unit tests
- Request logger middleware tests
- Not-found middleware tests
- Error middleware tests
- Test environment setup validation

## Key Concepts

- Express apps can be separated from server listeners
- Routers group related endpoints
- Middleware validates and prepares request data
- Controllers handle HTTP operations
- Stores own data access and mutation
- Environment variables configure runtime behavior
- Automated tests protect API contracts
- Unit tests protect module boundaries
- Error handlers should log internal details without exposing them
- Bad client input should return 400
- Missing resources should return 404
- Unexpected server failures should return 500

## Explanation From Memory

This backend API uses Express to define routes and middleware. The server
file starts the listener, while the app file builds and exports the
configured Express application. Task routes define endpoint paths and
middleware order. Validation middleware checks and normalizes client input
before controller functions run. Controllers handle HTTP responses and
call the task store for data operations. The task store owns the in-memory
records and returns copies so outside code cannot mutate internal state.
The project has automated tests for API behavior, store behavior, and
middleware behavior.
