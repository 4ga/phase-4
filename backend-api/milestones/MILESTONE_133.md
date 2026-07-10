# Milestone 133 — Extract Request Logger Middleware

## Completed

- Created src/middleware/requestLogger.js
- Moved request logging behavior out of app.js
- Exported shouldLogRequests
- Exported requestLogger
- Registered requestLogger in app.js
- Preserved quiet logging during tests
- Preserved visible logging during development
- Added unit tests for logging behavior
- Confirmed requestLogger always called next()
- Confirmed existing API and store tests still passed
- Confirmed seventy-seven tests passed

## Key Concepts

- Middleware can be extracted into focused modules
- app.js should assemble middleware rather than contain every implementation
- Environment-aware behavior can be unit tested directly
- Middleware should call next() when it does not send a response
- Tests that modify global state must restore it
- Mocking console.log allows logging behavior to be tested safely

## Verification

- Ran npm test without starting server.js
- Confirmed NODE_ENV=test suppressed request logging
- Confirmed NODE_ENV=development allowed request logging
- Confirmed requestLogger called next in both cases
- Confirmed app.js still registered the logger middleware
- Confirmed existing API tests still passed
- Confirmed existing store tests still passed
- Confirmed seventy-seven tests passed

## Explanation From Memory

The request logger is application middleware, so it belongs in its own
middleware module. The logger checks NODE_ENV before printing request
details. In test mode it skips console output but still calls next(), so
the request pipeline continues. In development mode it logs the method and
URL, then calls next().
