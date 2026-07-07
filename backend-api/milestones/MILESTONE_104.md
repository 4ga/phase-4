# Milestone 104 — Route Params and Query Strings

## Completed

- Moved task data into a reusable in-memory array
- Updated GET /api/tasks to support query string filters
- Added completed=true filtering
- Added completed=false filtering
- Added search filtering
- Added GET /api/tasks/:id route
- Returned a 404 response when a task was not found
- Manually tested route params and query strings

## Key Concepts

- Route params are required values inside the URL path
- Query strings are optional values after the ? in a URL
- req.params contains route parameter values
- req.query contains query string values
- Query string values arrive as strings
- APIs can use query strings for filtering and searching
- APIs can use route params to request one specific resource
- 404 means the requested resource was not found

## Manual Tests

- Visited http://localhost:3000/api/tasks
- Visited http://localhost:3000/api/tasks/1
- Visited http://localhost:3000/api/tasks/999
- Visited http://localhost:3000/api/tasks?completed=true
- Visited http://localhost:3000/api/tasks?completed=false
- Visited http://localhost:3000/api/tasks?search=http

## Explanation From Memory

A route param is part of the URL path, like /api/tasks/:id, and Express makes it available on req.params. A query string comes after the question mark in the URL, like ?completed=false, and Express makes it available on req.query. Params are good for identifying one resource. Query strings are good for optional filtering, searching, or sorting.
