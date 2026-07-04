# Milestone 115 — First Automated API Tests

## Completed

- Installed Supertest as a development dependency
- Added an npm test script
- Created a test directory
- Created the first API test file
- Imported the Express app without importing the server listener
- Used Node's built-in test runner
- Used Node's strict assertion module
- Sent test requests with Supertest
- Tested the health route
- Tested the task collection route
- Tested retrieving one task
- Tested a missing task response
- Tested an unknown endpoint response
- Temporarily caused an assertion failure
- Restored the assertion and confirmed all tests passed

## Test Coverage

- GET /health returns 200 and health information
- GET /api/tasks returns 200 and a tasks array
- GET /api/tasks/1 returns the requested task
- GET /api/tasks/999 returns a task-specific 404
- GET /api/unknown returns an unknown-route 404

## Key Concepts

- Automated tests execute repeatable checks
- API tests send requests and inspect responses
- Tests should check status codes
- Tests should check response bodies
- Tests may also check response headers
- node:test provides Node's built-in test runner
- node:assert/strict provides strict assertions
- Supertest sends HTTP requests to an Express application
- Tests should import app.js rather than starting server.js
- Successful behavior and failure behavior should both be tested
- A failing assertion causes a failing test
- Passing tests protect existing behavior during future changes

## Manual Verification

- Ran npm test without manually starting the API
- Confirmed five tests passed
- Confirmed the request logger ran during the tests
- Temporarily changed an expected status
- Confirmed the test suite reported a failure
- Restored the correct expected status
- Confirmed all tests passed again

## Explanation From Memory

An automated API test sends a request to the Express application and checks whether the response has the expected status, headers, and body. The tests import app.js rather than server.js so the normal network listener does not start. Supertest makes requests to the app, node:test runs the tests, and node:assert/strict verifies the results. If an assertion does not match the actual response, the test fails.
