# Milestone 111 — Unknown Route 404 Middleware

## Completed

- Added fallback middleware for unmatched routes
- Placed the fallback after all valid routes
- Returned a JSON 404 response instead of default HTML
- Included the request method in the response
- Included the requested path in the response
- Preserved task-specific missing-resource responses
- Confirmed valid routes continued to work

## Key Concepts

- A missing resource and an unknown route are different situations
- Route-specific middleware can handle a missing resource
- Fallback middleware can handle unmatched endpoints
- Express processes routes and middleware in order
- A fallback route must be placed after valid routes
- Middleware does not call next() when it sends the final response
- APIs should return predictable JSON error responses

## Manual Tests

- Requested GET /api/tasks and confirmed 200
- Requested GET /api/tasks/999 and confirmed Task not found
- Requested GET /api/unknown and confirmed Route not found
- Requested GET /api/tasks/1/details and confirmed Route not found
- Sent POST /api/info and confirmed Route not found
- Confirmed all unknown-route responses used JSON

## Explanation From Memory

The unknown-route middleware is placed after all valid routes. When a request matches a route, that route sends the response and the fallback is not reached. When no route matches, Express eventually reaches the fallback middleware, which sends a JSON 404 response. This is different from a valid task route where the requested task itself does not exist.
