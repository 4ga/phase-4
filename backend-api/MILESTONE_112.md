# Milestone 112 — Centralized Error-Handling Middleware

## Completed

- Added centralized Express error-handling middleware
- Used the four-parameter error middleware signature
- Placed the error handler after routes and unknown-route middleware
- Returned 400 for malformed JSON request bodies
- Returned 500 for unexpected server errors
- Logged internal errors on the server
- Returned safe generic messages to API clients
- Used next(error) to send an error to the centralized handler
- Checked res.headersSent before sending an error response
- Temporarily added an error-testing route
- Removed the testing route before committing
- Confirmed existing 400 and 404 behavior remained unchanged

## Key Concepts

- Error-handling middleware receives error, req, res, and next
- Express identifies error middleware by its four parameters
- next(error) skips normal middleware and looks for an error handler
- Expected validation failures should use appropriate 400 responses
- Missing resources and routes use 404 responses
- Unexpected server failures use 500 responses
- Internal error details should be logged on the server
- Internal error details should not be exposed to API clients
- Error-handling middleware should be placed after normal routes
- res.headersSent prevents sending a second response

## Manual Tests

- Sent malformed JSON and confirmed a JSON 400 response
- Temporarily requested an endpoint that called next(error)
- Confirmed the unexpected error returned a JSON 500 response
- Confirmed the real error appeared in the server terminal
- Removed the temporary error endpoint
- Confirmed GET /api/tasks still returned 200
- Confirmed missing tasks still returned Task not found
- Confirmed unknown routes still returned Route not found

## Explanation From Memory

Centralized error-handling middleware provides one place for unexpected request failures. A route can call next(error), which tells Express to skip normal middleware and find an error handler. The error handler logs the real failure for developers but sends a safe response to the client. Expected validation and resource errors can still be handled directly with appropriate 400 or 404 responses.
