# Milestone 126 — Extract Task Controllers

## Completed

- Created src/controllers/taskController.js
- Moved in-memory task state into the controller module
- Moved task reset behavior into the controller module
- Moved next-task-ID behavior into the controller module
- Moved collection filtering, sorting, and pagination into listTasks
- Moved resource lookup into the controller module
- Created getTask controller
- Created createTask controller
- Created updateTask controller
- Created deleteTask controller
- Simplified the task router
- Updated the automated test reset import
- Preserved all public API behavior
- Confirmed fifty-six tests passed

## Project Structure

src/
controllers/
taskController.js
middleware/
taskValidation.js
routes/
taskRoutes.js
app.js
server.js

## File Responsibilities

### taskRoutes.js

- Defines task endpoint paths
- Defines HTTP methods
- Defines middleware order
- Connects requests to controller functions

### taskController.js

- Stores temporary in-memory task state
- Resets task state for automated tests
- Finds tasks
- Lists and paginates tasks
- Creates tasks
- Updates tasks
- Deletes tasks
- Sends task success responses

### taskValidation.js

- Validates task IDs
- Validates collection query values
- Validates creation bodies
- Validates update bodies
- Normalizes trusted request values

## Key Concepts

- Routers define request paths and processing order
- Controllers perform endpoint operations
- Middleware validates and prepares request data
- Clear module responsibilities improve maintainability
- Named exports connect routes to controller functions
- Structural refactoring should preserve API behavior
- Automated tests provide protection during refactoring

## Verification

- Confirmed the task router contained no task array
- Confirmed the task router contained no CRUD implementation details
- Confirmed controller functions handled task operations
- Confirmed validation middleware remained separate
- Confirmed task state still reset before every test
- Confirmed GET, POST, PATCH, and DELETE behavior remained unchanged
- Confirmed filtering, sorting, and pagination remained unchanged
- Confirmed validation and error responses remained unchanged
- Confirmed fifty-six tests passed

## Explanation From Memory

The task router defines which middleware and controller functions handle
each task endpoint. The controller module contains the task state and the
functions that list, retrieve, create, update, and delete tasks. Validation
middleware prepares trusted input before the controllers run. This
separation changes project organization without changing the public API.
