# Milestone 117 — Isolated PATCH Route Tests

## Completed

- Kept the existing automated API tests
- Continued resetting in-memory state before every test
- Tested updating a task title
- Confirmed updated titles were trimmed
- Confirmed an updated task could be retrieved afterward
- Tested updating task completion
- Tested updating title and completion together
- Tested PATCH against a missing resource
- Tested blank-title validation
- Tested non-string-title validation
- Tested non-boolean completed validation
- Tested an empty update body
- Confirmed all tests remained isolated
- Confirmed eighteen total tests passed

## Test Coverage Added

- PATCH /api/tasks/:id updates title
- PATCH /api/tasks/:id trims title whitespace
- PATCH /api/tasks/:id persists updates in memory
- PATCH /api/tasks/:id updates completed
- PATCH /api/tasks/:id updates both supported fields
- PATCH /api/tasks/:id returns 404 for a missing task
- PATCH /api/tasks/:id returns 400 for a blank title
- PATCH /api/tasks/:id returns 400 for a non-string title
- PATCH /api/tasks/:id returns 400 for a non-boolean completed value
- PATCH /api/tasks/:id returns 400 for an empty update body

## Key Concepts

- PATCH updates part of an existing resource
- A PATCH body may contain one or multiple supported fields
- Fields that were not provided should remain unchanged
- Validation should happen before state mutation
- Strings and booleans must be validated by type
- A missing resource should return 404
- Invalid update data should return 400
- A successful update should return the updated resource
- A later GET request can confirm that an update was stored
- State-changing tests require predictable setup
- beforeEach prevents tests from depending on execution order

## Verification

- Ran npm test without starting server.js
- Confirmed all successful PATCH tests passed
- Confirmed all PATCH validation tests passed
- Confirmed missing-task middleware still returned 404
- Confirmed existing GET and POST tests still passed
- Confirmed eighteen tests passed in total
- Ran the suite more than once with the same result

## Explanation From Memory

PATCH tests modify the in-memory tasks, so each test must start from a known state. The beforeEach hook resets the tasks and ID counter before every test. Successful PATCH tests verify that only the provided fields change and that the updated task is returned. Invalid requests verify that the API returns 400, while a valid route with a missing task returns 404.
