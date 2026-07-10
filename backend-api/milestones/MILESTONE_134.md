# Milestone 134 — Extract Unknown Route and Error Middleware

## Completed

- Created src/middleware/notFoundHandler.js
- Created src/middleware/errorHandler.js
- Moved unknown-route behavior out of app.js
- Moved centralized error-handling behavior out of app.js
- Registered notFoundHandler after valid routes
- Registered errorHandler after notFoundHandler
- Added unit tests for notFoundHandler
- Added unit tests for malformed JSON errors
- Added unit tests for unexpected server errors
- Confirmed unexpected error details were not exposed
- Confirmed errors are forwarded when headers were already sent
- Confirmed internal errors are logged
- Preserved existing API behavior
- Confirmed eighty-three tests passed

## Key Concepts

- Unknown-route handling is middleware
- Centralized error handling is middleware
- Error middleware must have four parameters
- Middleware order controls which handler receives the request
- Not-found middleware belongs after valid routes
- Error middleware belongs after normal middleware
- Unexpected internal details should be logged, not exposed
- Middleware can be unit tested without HTTP requests

## Verification

- Ran npm test without starting server.js
- Confirmed unknown routes still returned JSON 404 responses
- Confirmed unsupported methods still returned JSON 404 responses
- Confirmed malformed JSON still returned JSON 400 responses
- Confirmed unexpected errors returned safe JSON 500 responses
- Confirmed existing API tests still passed
- Confirmed existing store tests still passed
- Confirmed request logger tests still passed
- Confirmed eighty-three tests passed

## Explanation From Memory

The not-found handler catches requests that do not match any route and
returns a JSON 404 response. The error handler catches parsing failures
and unexpected errors. It logs internal details for developers while
returning safe JSON responses to clients. Extracting both handlers keeps
app.js focused on assembling the application middleware pipeline.
