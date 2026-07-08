# Milestone 127 — Extract the In-Memory Task Store

## Completed

- Created src/data/taskStore.js
- Moved initial task data into the store
- Moved the next-task-ID counter into the store
- Moved resetTasks into the store
- Added getAllTasks
- Added getTaskById
- Added createTaskRecord
- Added updateTaskRecord
- Added deleteTaskRecord
- Returned copies of stored tasks
- Removed direct task-array access from the controller
- Updated controller functions to call store operations
- Removed task index handling from the request
- Updated the automated test reset import
- Preserved all public API behavior
- Confirmed fifty-six tests passed

## Project Structure

src/
controllers/
taskController.js
data/
taskStore.js
middleware/
taskValidation.js
routes/
taskRoutes.js
app.js
server.js

## File Responsibilities

### taskStore.js

- Owns in-memory task records
- Owns task ID generation
- Reads task records
- Creates task records
- Updates task records
- Deletes task records
- Resets test data
- Returns copies of stored records

### taskController.js

- Reads normalized request data
- Calls task-store operations
- Applies collection filtering, sorting, and pagination
- Sends HTTP success and missing-resource responses

### taskValidation.js

- Validates route parameters
- Validates query values
- Validates request bodies
- Normalizes trusted input

### taskRoutes.js

- Defines task paths
- Defines HTTP methods
- Defines middleware and controller order

## Key Concepts

- Data storage and HTTP handling are separate responsibilities
- Controllers should not directly own stored collections
- A data module can hide implementation details
- Store functions provide a controlled data-access interface
- Returning copies protects internal state
- The HTTP controller decides status codes and response shapes
- The in-memory store is temporary and resets with the process
- A later database layer can replace this store interface

## Verification

- Confirmed the controller no longer contained a task array
- Confirmed the controller no longer generated IDs
- Confirmed task creation used the store
- Confirmed task updates used the store
- Confirmed task deletion used the store
- Confirmed lookup used the store
- Confirmed resetTasks still isolated every test
- Confirmed filtering, sorting, and pagination still worked
- Confirmed all validation and error responses remained unchanged
- Confirmed fifty-six tests passed

## Explanation From Memory

The task store owns the in-memory records and provides functions for
reading and changing them. Controllers call those functions and remain
responsible for HTTP responses. The store returns copies so callers
cannot accidentally mutate its private state. This separation prepares
the project for persistent storage later without adding a database yet.
