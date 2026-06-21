# Milestone 103 — HTTP Request/Response Fundamentals

## Completed

- Added GET /api/info route
- Added GET /api/tasks route
- Returned JSON responses from Express
- Manually tested API routes in the browser
- Practiced request/response thinking

## Key Concepts

- HTTP is the request/response protocol used by browsers and APIs
- A client sends a request
- A server sends a response
- GET is used to request data
- JSON is the common format for API responses
- Express route handlers receive request and response objects
- res.json() sends JSON back to the client

## Manual Tests

- Visited http://localhost:3000/api/info
- Confirmed app metadata JSON returned
- Visited http://localhost:3000/api/tasks
- Confirmed tasks array JSON returned

## Explanation From Memory

HTTP works as a request and response cycle. The client asks for something by sending a request to a URL. Express matches that URL to a route handler. The handler uses the response object to send data back, often as JSON for APIs.
