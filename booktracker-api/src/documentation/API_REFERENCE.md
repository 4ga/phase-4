# Backend API Reference

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
Welcome to the book tracker app!
```

### GET /health

Returns basic health information.

#### Response

Status: `200`

```json
{
  "status": "ok",
  "phase": 4,
  "milestone": "Backend API implementation for the book tracker app"
}
```

### GET /api/info

Returns application metadata.

#### Response

Status: 200

```json
{
  "app": "Phase 4 backend API",
  "version": "1.0.0",
  "phase": 4,
  "message": "Backend API implementation for the book tracker app"
}
```

### GET /api/books

Returns a collection of books.

Supports filtering, searching, sorting, and pagination.

#### Query Parameters

| Parameter      | Allowed Values                                                                                                                                                                                          | Default | Description                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------- |
| `searchTerm`   | string                                                                                                                                                                                                  | none    | Filters by search term                        |
| `genre`        | `fiction` `fantasy`, `science`, `mystery`, `romance`, `historical-fiction`, `horror`, `biography`, `memoir`, `self-help`, `true crime`, `history`, `poetry`, `drama`, `how-to`, `non-fiction`, `sci-fi` | none    | Searches book genres case-insensitively       |
| `format`       | `hardcover`, `ebook`, `audiobook`, `paperback`                                                                                                                                                          | none    | Searches book formats case-insensitively      |
| `audience`     | `children`, `young-adult`, `adult`                                                                                                                                                                      | none    | Searches book audiences case-insensitively    |
| `avaialbility` | `available`, `checked-out`, `library-use-only`                                                                                                                                                          | none    | Searches book availability case-insensitively |
| `sortBy`       | `title-asc`, `title-desc`,`author-asc`, `author-desc`, `year-asc`, `year-desc`                                                                                                                          | none    | Sorts the collection                          |
| `page`         | positive integer                                                                                                                                                                                        | `1`     | Requested page                                |
| `limit`        | positive integer up to `100`                                                                                                                                                                            | `10`    | Max tasks per page                            |

#### Example

```txt
GET /api/books?format=hardcover&sortBy=title-asc&page=1&limit=2

```

#### Response

Status: `200`

```json
{
  "success": true,
  "books": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "publicationYear": 1925,
      "format": "hardcover",
      "genre": "fiction",
      "audience": "adult",
      "availability": "available",
      "createdAt": "2026-07-04T12:00:00.000Z",
      "updatedAt": "2026-07-04T12:00:00.000Z"
    },
    {
      "id": 4,
      "title": "The Hunger Games",
      "author": "Suzanne Collins",
      "publicationYear": 2008,
      "format": "hardcover",
      "genre": "sci-fi-fantasy",
      "audience": "young-adult",
      "availability": "library-use-only",
      "createdAt": "2026-07-04T12:00:00.000Z",
      "updatedAt": "2026-07-04T12:00:00.000Z"
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

### GET /api/books/:id

Returns one book by ID.

Task IDs must be positive integers.

#### Example

```txt
GET /api/books/1
```

#### Success Response

Status: `200`

```json
{
  "success": true,
  "book": {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "publicationYear": 1925,
    "format": "hardcover",
    "genre": "fiction",
    "audience": "adult",
    "availability": "available"
  }
}
```

#### Invalid ID Response

Status: `400`

```json
{
  "error": "Book id must be a positive integer"
}
```

#### Missing Book Response

Status: `404`

```json
{
  "error": "Book not found"
}
```

### POST /api/books

Creates a new book.

#### Request Body

```json
{
  "title": "Dune",
  "author": "Frank Herbert",
  "publicationYear": 1965,
  "format": "hardcover",
  "genre": "sci-if",
  "audience": "young-adult",
  "availability": "available"
}
```

#### Rules

The following are required, must be a string, cannot be blank and the surrounding whitespace is trimmed:

- `title`, `author`, `format`, `format`, `genre`, `audience`, `availability`

The following must be a positive number and cannot be left blank:

- `publicationYear`

#### Success Response

Status: `201`

```json
{
  "success": true,
  "book": {
    "id": 8,
    "title": "Dune",
    "author": "Frank Herbert",
    "publicationYear": 1965,
    "format": "hardcover",
    "genre": "sci-if",
    "audience": "young-adult",
    "availability": "available"
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

#### Missing or Blank Author Response

Status: `400`

```json
{
  "error": "Author is required"
}
```

#### Invalid Author Response

Status: `400`

```json
{
  "error": "Author is required"
}
```

#### Missing or Blank Publication Year Response

Status: `400`

```json
{
  "error": "Publication Year is required"
}
```

#### Invalid PUblication Year Response

Status: `400`

```json
{
  "error": "Publication Year is required"
}
```

#### Missing or Blank Format Response

Status: `400`

```json
{
  "error": "Format is required"
}
```

#### Invalid Format Response

Status: `400`

```json
{
  "error": "Format is required"
}
```

#### Missing or Blank Genre Response

Status: `400`

```json
{
  "error": "Genre is required"
}
```

#### Invalid Genre Response

Status: `400`

```json
{
  "error": "Genre is required"
}
```

#### Missing or Blank Audience Response

Status: `400`

```json
{
  "error": "Audience is required"
}
```

#### Invalid Audience Response

Status: `400`

```json
{
  "error": "Audience is required"
}
```

#### Missing or Blank Availability Response

Status: `400`

```json
{
  "error": "Availability is required"
}
```

#### Invalid Availability Response

Status: `400`

```json
{
  "error": "Availability is required"
}
```

### PATCH /api/books/:id

Updates part of an existing book.

#### Request Body

```json
{
  "title": "Updated book title",
  "availability": "library-use-only"
}
```

Both fields are optional, but at least one supported field must be provided.

#### Rules

- `id` must be a positive integer.
- `title`, when provided, must be a non-blank string.
- `availability`, when provided, must be a non-blank string.
- Surrounding whitespace is trimmed from `title` and `availability`.

#### Success Response

Status: 200

```json
{
  "success": true,
  "book": {
    "id": 8,
    "title": "Updated book title",
    "author": "Frank Herbert",
    "publicationYear": 1965,
    "format": "hardcover",
    "genre": "sci-if",
    "audience": "young-adult",
    "availability": "library-use-only"
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
  "error": "Availability must be a string"
}
```

#### Missing Book Response

Status: 404

```json
{
  "error": "Book not found"
}
```

### DELETE /api/books/:id

Deletes an existing book.

#### Example

```txt
DELETE /api/books/8
```

#### Success Response

Status: `204`

No response body.

#### Invalid ID Response

Status: `400`

```json
{
  "error": "Book id must be a positive integer"
}
```

#### Missing Book Response

Status: `404`

```json
{
  "error": "Book not found"
}
```

### Query Validation Errors

#### Invalid Genre Filter

Status: `400`

```json
{
  "error": "Genre filter must be a string"
}
```

#### Invalid Search Filter

Status: `400`

```json
{
  "error": "Search filter must be a string"
}
```

#### Invalid sortBy Field

Status: `400`

```json
{
  "error": "sortBy filter must be a string"
}
```

#### Invalid Format Field

Status: `400`

```json
{
  "error": "Format filter must be a string"
}
```

#### Invalid Audience Field

Status: `400`

```json
{
  "error": "Audience filter must be a string"
}
```

#### Invalid Availability Field

Status: `400`

```json
{
  "error": "Availability filter must be a string"
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
