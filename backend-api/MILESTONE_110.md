# Milestone 110 — Resource Lookup Middleware

## Completed

- Identified repeated resource lookup logic
- Created reusable findTaskById middleware
- Read the task ID from req.params
- Found the task and its array index
- Returned 404 from middleware when the task was missing
- Attached the task and task index to req
- Called next() when the task existed
- Used the middleware in GET, PATCH, and DELETE routes
- Added type validation for PATCH title values
- Preserved existing successful response behavior

## Key Concepts

- Route-specific middleware runs only on selected routes
- A route can contain multiple callback functions
- Middleware can perform shared work before a route handler
- Middleware can attach values to the request object
- next() passes control to the next callback
- Sending a response ends the request and should not be followed by next()
- Shared middleware reduces duplicated code
- Shared middleware keeps 404 behavior consistent
- Input types should be checked before using type-specific methods

## Manual Tests

- Retrieved an existing task by ID
- Requested a missing task and confirmed 404
- Updated an existing task
- Sent a numeric title and confirmed 400
- Tried updating a missing task and confirmed 404
- Deleted an existing task and confirmed 204
- Tried deleting a missing task and confirmed 404

## Explanation From Memory

The findTaskById middleware performs shared lookup work for routes that operate on one task. It reads the ID, finds the task and its array index, and returns 404 if the resource does not exist. When it finds the task, it attaches the task and index to req and calls next(). The GET, PATCH, and DELETE handlers can then use those values without repeating the lookup code.
