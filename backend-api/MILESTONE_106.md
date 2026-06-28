# Milestone 106 — PATCH Routes: Updating Existing Resources

## Completed

- Added PATCH /api/tasks/:id route
- Used req.params to find the task id
- Used req.body to read update data
- Updated task title
- Updated task completed status
- Returned 404 when task was not found
- Returned 400 for invalid title
- Returned 400 for invalid completed value
- Returned 400 when no update fields were provided
- Manually tested successful and invalid PATCH requests

## Key Concepts

- PATCH is used to update part of an existing resource
- Route params identify which resource to update
- Request bodies contain the new data
- Validation should happen before changing data
- 400 means the client sent invalid data
- 404 means the requested resource does not exist
- In-memory updates disappear when the server restarts

## Manual Tests

- Sent PATCH /api/tasks/1 with a new title
- Sent PATCH /api/tasks/1 with completed true
- Sent PATCH /api/tasks/2 with both title and completed
- Sent PATCH /api/tasks/999 and confirmed 404
- Sent empty title and confirmed 400
- Sent invalid completed value and confirmed 400
- Sent empty body and confirmed 400

## Explanation From Memory

PATCH requests update part of an existing resource. The route param tells the server which resource to update, and the request body tells the server what fields should change. The server should first find the resource, validate the incoming data, update only the provided fields, and return the updated resource.
