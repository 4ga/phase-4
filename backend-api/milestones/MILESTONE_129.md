# Milestone 129 — General Route and JSON Error Tests

## Completed

- Added automated test coverage for GET /
- Added automated test coverage for GET /api/info
- Added automated test coverage for unsupported methods
- Added automated test coverage for malformed JSON bodies
- Confirmed unknown-route fallback handled unsupported methods
- Confirmed centralized error middleware handled invalid JSON
- Preserved all existing API and store tests
- Confirmed sixty-eight total tests passed

## Test Coverage Added

- GET / returns the root text response
- GET /api/info returns application metadata
- POST /api/info returns a JSON 404 fallback response
- Malformed JSON request bodies return a JSON 400 response

## Key Concepts

- General app routes should be tested too
- Unsupported HTTP methods can fall through to route-not-found middleware
- express.json() parses JSON before route handlers run
- Malformed JSON can be handled by centralized error middleware
- Error responses should remain predictable JSON
- Automated tests replace repeated manual verification
- Tests should import app.js without starting server.js

## Verification

- Ran npm test without starting server.js
- Confirmed all existing API tests still passed
- Confirmed all task-store unit tests still passed
- Confirmed root route testing passed
- Confirmed app-info route testing passed
- Confirmed unsupported method fallback testing passed
- Confirmed malformed JSON testing passed
- Confirmed sixty-eight tests passed

## Explanation From Memory

General application routes are part of the API contract and should be
covered by automated tests. Unsupported methods fall through to the
unknown-route middleware when no route matches the method and path.
Malformed JSON is caught during body parsing before the route handler
runs, and the centralized error middleware returns a safe JSON 400
response.
