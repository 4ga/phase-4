# Milestone 120 — Extract Task Validation Middleware

## Completed

- Created src/middleware/taskValidation.js
- Created validateCreateTask middleware
- Created validateUpdateTask middleware
- Moved POST request-body validation out of the task route
- Moved PATCH request-body validation out of the task route
- Normalized valid titles inside validation middleware
- Called next() after successful validation
- Preserved existing validation messages
- Preserved existing status codes
- Kept findTaskById before PATCH validation
- Simplified the POST route handler
- Simplified the PATCH route handler
- Confirmed all twenty-two tests still passed

## Project Structure

src/
middleware/
taskValidation.js
routes/
taskRoutes.js
app.js
server.js

## Middleware Responsibilities

### validateCreateTask

- Requires a title
- Requires the title to be a string
- Rejects blank titles
- Trims valid titles
- Passes control to the creation handler

### validateUpdateTask

- Requires at least one supported update field
- Validates an optional title
- Rejects blank update titles
- Trims valid update titles
- Validates an optional completed value
- Passes control to the update handler

## Key Concepts

- Validation can be separated from resource mutation
- Route middleware can run before a final route handler
- Invalid middleware input can end the response immediately
- Valid middleware input should call next()
- Middleware can normalize request data
- Route handlers can rely on guarantees established by earlier middleware
- Middleware order affects API behavior
- Structural refactoring should preserve the public API contract
- Existing tests protect behavior during refactoring

## Verification

- Ran npm test without starting server.js
- Confirmed GET tests still passed
- Confirmed POST creation and validation tests still passed
- Confirmed PATCH update and validation tests still passed
- Confirmed DELETE tests still passed
- Confirmed missing PATCH resources still returned 404
- Temporarily removed next() from validation middleware
- Observed the valid request pipeline stop
- Restored next()
- Confirmed twenty-two tests passed

## Explanation From Memory

Task validation middleware checks and normalizes request data before the final route handler runs. Invalid input produces a 400 response immediately. Valid input is passed forward with next(). The POST and PATCH handlers can therefore focus on creating or updating task state instead of repeating validation logic. Middleware order remains important because the lookup middleware must continue returning 404 for missing tasks before PATCH validation runs.
