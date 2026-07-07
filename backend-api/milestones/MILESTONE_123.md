# Milestone 123 — Validated Collection Sorting

## Completed

- Added sortBy query validation
- Added sort order validation
- Supported sorting by id
- Supported sorting by title
- Supported ascending and descending order
- Defaulted to ascending order
- Normalized sorting query values
- Rejected invalid sorting values
- Rejected repeated sorting values
- Rejected order without a sort field
- Applied filters before sorting
- Sorted a copied array
- Confirmed sorting did not mutate task state
- Confirmed forty-two tests passed

## Supported Queries

- GET /api/tasks?sortBy=id
- GET /api/tasks?sortBy=id&order=desc
- GET /api/tasks?sortBy=title
- GET /api/tasks?sortBy=title&order=desc
- GET /api/tasks?completed=false&sortBy=title&order=desc

## Key Concepts

- Sorting is a derived collection operation
- Query sorting values require validation
- Normalization gives route handlers predictable values
- Sort direction can change comparator results
- Filtering can be applied before sorting
- Array sorting should not mutate application source state
- Repeated query values are ambiguous and should be rejected
- Tests protect collection order and API error behavior

## Verification

- Confirmed title sorting defaulted to ascending
- Confirmed descending title sorting worked
- Confirmed descending ID sorting worked
- Confirmed filtering and sorting worked together
- Confirmed sorting did not change the source collection order
- Confirmed invalid sort fields returned 400
- Confirmed invalid sort orders returned 400
- Confirmed repeated sorting values returned 400
- Confirmed order without sortBy returned 400
- Confirmed existing tests still passed
- Confirmed forty-two tests passed

## Explanation From Memory

The sorting query parameters are validated and normalized before the
collection handler uses them. The route first applies optional filters,
then creates a copy of the filtered array and sorts that copy. This
returns a derived ordering without changing the underlying in-memory
task collection.
