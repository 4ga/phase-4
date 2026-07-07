# Milestone 125 — Task ID Route-Parameter Validation

## Completed

- Added validateTaskId middleware
- Validated task route parameters before resource lookup
- Accepted only positive integer task IDs
- Rejected text IDs
- Rejected zero
- Rejected negative IDs
- Rejected decimal IDs
- Converted valid task IDs into numbers
- Stored normalized IDs on req.taskId
- Updated findTaskById to use the normalized ID
- Added task ID validation to GET, PATCH, and DELETE routes
- Preserved 404 responses for valid missing IDs
- Confirmed fifty-six tests passed

## Response Behavior

- Invalid task ID format returns 400
- Valid existing task ID continues to the route handler
- Valid missing task ID returns 404
- Invalid update data for an existing task returns 400

## Key Concepts

- Route parameters are client-controlled input
- Route parameters arrive as strings
- Validation should occur before resource lookup
- Middleware can normalize route parameters
- Later middleware can rely on normalized request values
- 400 represents malformed client input
- 404 represents a valid identifier with no matching resource
- Middleware order controls which response takes priority

## Verification

- Confirmed text task IDs returned 400
- Confirmed task ID zero returned 400
- Confirmed decimal task IDs returned 400
- Confirmed negative task IDs returned 400
- Confirmed existing task IDs still worked
- Confirmed valid missing IDs still returned 404
- Confirmed existing CRUD, filtering, sorting, and pagination tests passed
- Confirmed fifty-six tests passed

## Explanation From Memory

Task route parameters are untrusted strings and should be validated before
the application searches for a resource. The validateTaskId middleware
accepts only positive integer strings, converts the value into a number,
and stores it on req.taskId. The lookup middleware then searches using
that normalized value. Malformed IDs return 400, while valid IDs that do
not match a task return 404.
