# Milestone 102 — Phase 4 Setup: Backend and APIs

## Completed

- Created Phase 4 backend project folder
- Initialized npm project
- Installed Express
- Created basic Express server
- Added root route
- Added health route
- Confirmed server runs locally
- Confirmed JSON response from /health

## Key Concepts

- Node.js lets JavaScript run outside the browser
- npm manages project metadata, scripts, and dependencies
- Express helps create HTTP servers and routes
- A route connects an HTTP method and URL path to a response
- The browser or client sends a request
- The server sends a response

## Manual Tests

- Visited http://localhost:3000
- Visited http://localhost:3000/health
- Confirmed JSON response returned successfully

## Explanation From Memory

A backend server listens for HTTP requests. Express lets me define routes like GET /health. When the client visits that URL, the matching route handler runs and sends back a response.
