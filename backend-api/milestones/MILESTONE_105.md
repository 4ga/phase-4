# Milestone 105 — Request Bodies and POST Routes

## Completed

- Added express.json() middleware
- Added POST /api/tasks route
- Read title from req.body
- Validated required title
- Returned 400 for invalid input
- Created a new in-memory task
- Returned 201 for successful creation
- Confirmed new task appears in GET /api/tasks
- Confirmed in-memory data resets after server restart

## Key Concepts

- POST is commonly used to create new resources
- Request bodies carry data from the client to the server
- express.json() parses JSON request bodies
- req.body contains parsed body data
- Validation protects the server from bad input
- 400 means the client sent invalid data
- 201 means a resource was created successfully
- In-memory data is temporary and disappears when the server restarts

## Manual Tests

- Sent valid POST /api/tasks request with curl
- Confirmed new task was returned
- Sent GET /api/tasks and confirmed the new task appeared
- Sent invalid POST /api/tasks request with empty title
- Confirmed 400 validation error returned

## Explanation From Memory

GET requests ask the server for data. POST requests send data to the server, usually to create something new. Express needs express.json() middleware to parse JSON request bodies. After that, route handlers can read client data from req.body, validate it, create a resource, and return a response with the right status code.
