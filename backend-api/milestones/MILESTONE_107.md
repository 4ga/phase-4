# Milestone 107 — DELETE Routes: Removing Resources

## Completed

- Added DELETE /api/tasks/:id
- Read the task id from req.params
- Found the task's array index
- Removed the task from the in-memory array
- Returned 204 after successful deletion
- Returned 404 when the task was not found
- Confirmed the deleted task disappeared from GET /api/tasks

## Key Concepts

- DELETE is used to remove a resource
- Route params identify the resource to delete
- findIndex() returns the array position of a matching item
- findIndex() returns -1 when no matching item exists
- splice() can remove an item from an array
- 204 means the request succeeded and no response body is returned
- 404 means the requested resource does not exist
- In-memory deletions disappear when the server restarts

## Manual Tests

- Viewed all tasks before deletion
- Deleted an existing task
- Confirmed the response status was 204
- Confirmed the deleted task disappeared
- Tried deleting the same task again
- Confirmed the response status was 404
- Tried deleting a nonexistent task id
- Confirmed the response status was 404

## Explanation From Memory

A DELETE request removes a resource identified by a route parameter. The server finds the resource's position in the array, returns 404 if it does not exist, and removes it if it does. A successful deletion can return 204 No Content because the server does not need to send a response body.
