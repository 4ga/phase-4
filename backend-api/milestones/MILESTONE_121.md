# Milestone 121 — Automated Query-String Filter Tests

## Completed

- Kept all existing automated API tests
- Used Supertest query parameters
- Tested completed=true filtering
- Tested completed=false filtering
- Tested case-insensitive title searching
- Tested combined completed and search filters
- Confirmed filtering did not mutate task state
- Confirmed twenty-seven total tests passed

## Test Coverage Added

- GET /api/tasks?completed=true returns completed tasks
- GET /api/tasks?completed=false returns incomplete tasks
- GET /api/tasks?search=EXPRESS performs a case-insensitive search
- GET /api/tasks combines completed and search filters
- Filtered requests do not alter the original task collection

## Key Concepts

- Query strings provide optional collection controls
- Express exposes query values through req.query
- Query-string values arrive as strings
- Collection filters can be combined
- Search behavior can be case-insensitive
- Filtering should derive a result rather than mutate source state
- Automated tests protect API filtering behavior
- Supertest can construct query strings with query()
- beforeEach keeps every test predictable

## Verification

- Ran npm test without starting server.js
- Confirmed completed=true returned task 3
- Confirmed completed=false returned tasks 1 and 2
- Confirmed uppercase EXPRESS matched task 2
- Confirmed combined filters returned task 2
- Confirmed an unfiltered request still returned tasks 1, 2, and 3
- Confirmed existing CRUD tests still passed
- Confirmed twenty-seven tests passed
- Ran the suite more than once with the same result

## Explanation From Memory

Query strings allow clients to request a filtered version of a collection without changing the endpoint. Express provides these values through req.query, and the values arrive as strings. The API applies completed and search filters to produce a derived array for the response. The original in-memory task collection remains unchanged.
