# Milestone 131 — Environment-Aware Request Logging

## Completed

- Kept the request logging middleware
- Added an environment check for request logging
- Suppressed request logs when NODE_ENV is test
- Preserved request logs during development
- Updated the npm test script to set NODE_ENV
- Added a test confirming NODE_ENV is test during the suite
- Confirmed API behavior remained unchanged
- Confirmed store tests remained unchanged
- Confirmed seventy-three tests passed

## Key Concepts

- Environment variables can control runtime behavior
- NODE_ENV commonly identifies the current runtime mode
- Middleware can behave differently by environment
- Tests should be readable and not flooded with development logs
- Suppressing logs during tests should not remove logging from development
- Developer-experience improvements should preserve API behavior

## Verification

- Ran npm test without manually starting server.js
- Confirmed NODE_ENV was test during the suite
- Confirmed request logs were quiet during tests
- Confirmed existing API tests still passed
- Confirmed existing store tests still passed
- Ran npm run dev
- Confirmed request logs still appeared during development
- Confirmed seventy-three tests passed

## Explanation From Memory

The request logger remains part of the Express middleware pipeline, but it
checks NODE_ENV before printing. The test script sets NODE_ENV to test, so
the logger does not flood the test output. Development runs still show
request logs. This changes runtime behavior by environment without
changing the public API.
