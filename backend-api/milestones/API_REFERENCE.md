# Phase 4 Backend API Reference

## Base URL

Local development:

```txt
http://localhost:3000
```

## General Routes

### GET /

Returns a plain text confirmation that the API is running.

#### Response

Status: `200`

```txt
Phase 4 Backend API is running
```

### GET /health

Returns basic health information.

#### Response

Status: `200`

```json
{
  "status": "ok",
  "phase": 4,
  "milestone": 102
}
```

### GET /api/info

Returns application metadata.

#### Response

Status: 200

```json
{
  "app": "Phase 4 Backend API",
  "version": "1.0.0",
  "phase": 4,
  "milestone": 103,
  "message": "Learning HTTP request and response fundamentals"
}
```

### GET /api/tasks

Returns a collection of tasks.

Supports filtering, searching, sorting, and pagination.

#### Query Parameters

| Parameter   | Allowed Values               | Default                         | Description                             |
| ----------- | ---------------------------- | ------------------------------- | --------------------------------------- |
| `completed` | `true`, `false`              | none                            | Filters by completion status            |
| `search`    | string                       | none                            | Searches task titles case-insensitively |
| `sortBy`    | `id`, `title`                | none                            | Sorts the collection                    |
| `order`     | `asc`, `desc`                | `asc` when `sortBy` is provided | Sort direction                          |
| `page`      | positive integer             | `1`                             | Requested page                          |
| `limit`     | positive integer up to `100` | `10`                            | Max tasks per page                      |

#### Example

```txt
GET /api/tasks?completed=false&sortBy=title&order=desc&page=1&limit=2

```

#### Response

Status: `200`

```json
{
  "tasks": [
    {
      "id": 2,
      "title": "Practice Express routes",
      "completed": false
    },
    {
      "id": 1,
      "title": "Learn HTTP basics",
      "completed": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 2,
    "totalItems": 2,
    "totalPages": 1
  }
}
```

### GET /api/tasks/:id

Returns one task by ID.

Task IDs must be positive integers.

#### Example

```txt
GET /api/tasks/1
```

#### Success Response

Status: `200`

```json
{
  "task": {
    "id": 1,
    "title": "Learn HTTP basics",
    "completed": false
  }
}
```

#### Invalid ID Response

Status: `400`

```json
{
  "error": "Task id must be a positive integer"
}
```

#### Missing Task Response

Status: `404`

```json
{
  "error": "Task not found"
}
```

### POST /api/tasks

Creates a new task.

#### Request Body

```json
{
  "title": "Create API documentation"
}
```

#### Rules

- `title` is required.
- `title` must be a string.
- `title` cannot be blank.
- Surrounding whitespace is trimmed.
- New tasks are created with `completed: false`.

#### Success Response

Status: `201`

```json
{
  "task": {
    "id": 4,
    "title": "Create API documentation",
    "completed": false
  }
}
```

#### Missing or Blank Title Response

Status: `400`

```json
{
  "error": "Title is required"
}
```

#### Invalid Title Response

Status: `400`

```json
{
  "error": "Title is required"
}
```

### PATCH /api/tasks/:id

Updates part of an existing task.

#### Request Body

```json
{
  "title": "Updated task title",
  "completed": true
}
```

Both fields are optional, but at least one supported field must be provided.

#### Rules

- `id` must be a positive integer.
- `title`, when provided, must be a non-blank string.
- `completed`, when provided, must be a boolean.
- Surrounding whitespace is trimmed from `title`.

#### Success Response

Status: 200

```json
{
  "task": {
    "id": 1,
    "title": "Updated task title",
    "completed": true
  }
}
```

#### Missing Fields Response

Status: 400

```json
{
  "error": "At least one field is required"
}
```

#### Blank Title Response

Status: 400

```json
{
  "error": "Title cannot be empty"
}
```

#### Invalid Title Type Response

Status: 400

```json
{
  "error": "Title must be a string"
}
```

#### Invalid Completed Type Response

Status: 400

```json
{
  "error": "Completed must be a boolean"
}
```

#### Missing Task Response

Status: 404

```json
{
  "error": "Task not found"
}
```

### DELETE /api/tasks/:id

Deletes an existing task.

#### Example

```txt
DELETE /api/tasks/2
```

#### Success Response

Status: `204`

No response body.

#### Invalid ID Response

Status: `400`

```json
{
  "error": "Task id must be a positive integer"
}
```

#### Missing Task Response

Status: `404`

```json
{
  "error": "Task not found"
}
```

### Query Validation Errors

#### Invalid Completed Filter

Status: `400`

```json
{
  "error": "Completed filter must be true or false"
}
```

#### Invalid Search Filter

Status: `400`

```json
{
  "error": "Search filter must be a string"
}
```

#### Invalid Sort Field

Status: `400`

```json
{
  "error": "Search filter must be a string"
}
```

#### Invalid Sort Order

Status: `400`

```json
{
  "error": "Sort order must be asc or desc"
}
```

#### Sort Order Without Sort Field

Status: `400`

```json
{
  "error": "Sort field is required when sort order is provided"
}
```

#### Invalid Page

Status: `400`

```json
{
  "error": "Page must be a positive integer"
}
```

#### Invalid Limit

Status: `400`

```json
{
  "error": "Limit must be a positive integer"
}
```

#### Excessive Limit

Status: `400`

```json
{
  "error": "Limit must be 100 or less"
}
```

### General Error Responses

#### Unknown Route

Status: `404`

```json
{
  "error": "Route not found",
  "method": "GET",
  "path": "/api/unknown"
}
```

#### Unsupported Method

Status: `404`

```json
{
  "error": "Route not found",
  "method": "POST",
  "path": "/api/info"
}
```

#### Malformed JSON

Status: `400`

```json
{
  "error": "Invalid JSON body"
}
```

#### Unexpected Server Error

Status: `500`

```json
{
  "error": "Internal server error"
}
```

### Current Storage Behavior

This API currently uses an in-membory task store.

That means:

- Tasks reset when the Node process restarts.
- Data is not persisted to a database yet.
- IDs are generated by the in-memory store.
- The store returns copies of task records to protect internal state.

Persistent storage will be added later.