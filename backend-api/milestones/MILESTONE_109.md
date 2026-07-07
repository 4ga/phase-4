# Milestone 109 — Custom Express Middleware

## Completed

- Reviewed express.json() as built-in middleware
- Added custom application-level logging middleware
- Logged the HTTP request method
- Logged the original request URL
- Called next() to continue the request pipeline
- Confirmed middleware ran before route handlers
- Tested GET, POST, PATCH, and query-string requests
- Observed what happened when next() was temporarily removed
- Restored next() before committing

## Key Concepts

- Middleware runs during the request-response cycle
- Middleware receives req, res, and next
- req contains incoming request information
- res is used to produce a response
- next() passes control to the next middleware or route handler
- Middleware can run for every request
- Middleware order matters
- Middleware must either send a response or call next()
- express.json() is built-in Express middleware

## Manual Tests

- Sent GET /api/tasks and confirmed it was logged
- Sent GET /api/tasks/1 and confirmed it was logged
- Sent POST /api/tasks and confirmed it was logged
- Sent PATCH /api/tasks/1 and confirmed it was logged
- Sent a request with a query string and confirmed the full URL was logged
- Confirmed all routes still returned normal responses
- Temporarily removed next() and observed that the request did not continue
- Restored next() and confirmed normal behavior returned

## Explanation From Memory

Middleware is code that runs during the request-response pipeline. It can inspect or change the request and response, send a response itself, or pass control to the next middleware or route handler. When middleware does not send a response, it must call next() so the request can continue.
