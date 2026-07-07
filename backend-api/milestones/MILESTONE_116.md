# Milestone 116 — Isolated POST Route Tests

## Completed

- Preserved a copy of the initial task data
- Created a function that clones the initial tasks
- Extracted the next-task-ID calculation
- Created and exported resetTasks
- Reset the task collection before every test
- Reset nextTaskId before every test
- Added POST title type validation
- Tested successful task creation
- Confirmed a created task could be retrieved
- Tested title trimming
- Tested a missing title
- Tested a whitespace-only title
- Tested a non-string title
- Confirmed all existing tests still passed
- Confirmed ten total tests passed

## Test Coverage Added

- POST /api/tasks returns 201 for valid data
- POST /api/tasks stores the new task
- POST /api/tasks trims surrounding whitespace
- POST /api/tasks returns 400 when title is missing
- POST /api/tasks returns 400 when title is blank
- POST /api/tasks returns 400 when title is not a string

## Key Concepts

- State-changing tests can affect other tests
- Tests should begin from a known state
- Tests should not depend on execution order
- beforeEach performs setup before every test
- Test setup can restore in-memory data
- Test setup must also restore related counters
- Initial data should be cloned instead of reused by reference
- Validation should occur before state mutation
- Input types should be checked before calling type-specific methods
- A successful POST response should use status 201
- Automated tests should cover successful and invalid requests

## Verification

- Ran npm test without starting server.js
- Confirmed the five existing tests still passed
- Confirmed five POST tests passed
- Confirmed both successful POST tests received ID 4
- Confirmed invalid numeric titles returned 400 instead of 500
- Confirmed ten tests passed in total

## Explanation From Memory

POST tests change the application's in-memory state, so one test could affect another if the data is not reset. The beforeEach hook calls resetTasks before every test. resetTasks restores cloned copies of the original tasks and recalculates nextTaskId. This gives every test the same predictable starting state and prevents tests from depending on execution order.
