# Milestone 118 — Isolated DELETE Route Tests

## Completed

- Kept all existing automated API tests
- Continued resetting task state before every test
- Tested successful task deletion
- Confirmed successful deletion returned 204
- Confirmed the 204 response contained no body
- Confirmed the deleted task returned 404 afterward
- Confirmed unrelated tasks remained available
- Confirmed the deleted task disappeared from the task collection
- Tested deleting a missing task
- Confirmed the shared lookup middleware returned 404
- Confirmed twenty-two total tests passed

## Test Coverage Added

- DELETE /api/tasks/:id returns 204 for an existing task
- DELETE /api/tasks/:id returns no response body
- DELETE /api/tasks/:id removes the requested task
- DELETE /api/tasks/:id does not remove unrelated tasks
- DELETE /api/tasks/:id removes the task from the collection
- DELETE /api/tasks/:id returns 404 for a missing task

## Key Concepts

- DELETE removes an existing resource
- A successful DELETE request can return 204 No Content
- A 204 response should not contain a response body
- A later GET request can confirm that deletion persisted
- Collection tests can confirm the underlying data changed
- A targeted deletion should not affect unrelated resources
- Missing resources should return 404
- Shared route middleware keeps missing-resource behavior consistent
- State-changing tests require isolated setup
- beforeEach restores deleted resources before the next test

## Verification

- Ran npm test without starting server.js
- Confirmed successful DELETE returned 204
- Confirmed the successful response body was empty
- Confirmed the deleted task returned 404 afterward
- Confirmed another task remained available
- Confirmed the task collection no longer included the deleted ID
- Confirmed deleting a missing task returned 404
- Confirmed existing GET, POST, and PATCH tests still passed
- Confirmed twenty-two tests passed in total
- Ran the suite more than once with the same result

## Explanation From Memory

A successful DELETE request returns 204 No Content because the resource was removed and no response body is required. The test suite verifies more than the status code: it requests the deleted task afterward, checks that the task returns 404, and confirms the collection no longer contains it. The beforeEach hook resets the in-memory data so deletion tests do not affect other tests.
