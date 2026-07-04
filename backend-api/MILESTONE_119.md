# Milestone 119 — Extract Task Routes with Express Router

## Completed

- Created src/routes/taskRoutes.js
- Created an Express Router for task endpoints
- Moved initial task data into the task router module
- Moved task state reset logic into the task router module
- Moved next-task-ID logic into the task router module
- Moved findTaskById middleware into the task router module
- Moved all task CRUD routes into the task router module
- Changed task routes to use paths relative to the router mount
- Exported the task router as the default export
- Continued exporting resetTasks as a named export
- Mounted the router at /api/tasks
- Removed duplicate task logic from app.js
- Updated the automated test import
- Preserved all public task URLs
- Confirmed all twenty-two tests still passed

## Project Structure

src/
routes/
taskRoutes.js
app.js
server.js

## File Responsibilities

### taskRoutes.js

- Stores temporary in-memory task data
- Resets task state for automated tests
- Calculates the next task ID
- Finds tasks by route parameter
- Defines task collection routes
- Defines single-task routes
- Exports the task router

### app.js

- Creates the main Express application
- Registers global middleware
- Defines general application routes
- Mounts the task router
- Handles unknown routes
- Handles centralized errors
- Exports the application

### server.js

- Reads the configured port
- Imports the Express application
- Starts the network listener

## Key Concepts

- Express Router groups related endpoints
- A router is mounted at a path in the main application
- Router paths are relative to their mount path
- app.use() can mount a router
- Related route middleware can remain with its routes
- Structural refactoring should preserve public behavior
- Automated tests provide protection during refactoring
- Route and middleware order remains important
- ES module files can have default and named exports

## Verification

- Ran npm test without starting server.js
- Confirmed all GET tests passed
- Confirmed all POST tests passed
- Confirmed all PATCH tests passed
- Confirmed all DELETE tests passed
- Confirmed task state still reset before each test
- Confirmed all public task URLs remained unchanged
- Confirmed unknown-route handling still worked
- Confirmed twenty-two tests passed
- Ran the suite more than once with the same result

## Explanation From Memory

Express Router allows related endpoints to be grouped in a separate module. The task router defines paths relative to its mount point. The main application mounts it at /api/tasks, so the router's / path becomes /api/tasks and its /:id path becomes /api/tasks/:id. The refactor changes where the code lives without changing the public API behavior.
