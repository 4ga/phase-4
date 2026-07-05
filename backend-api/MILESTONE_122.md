# Milestone 122 — Query Validation and Normalization Middleware

## Completed

- Added validateTaskQuery middleware
- Validated the completed query filter
- Allowed only the strings true and false
- Converted valid completed values into booleans
- Validated the search filter type
- Trimmed valid search text
- Normalized valid search text to lowercase
- Stored normalized filters on req.taskFilters
- Added query validation before collection filtering
- Rejected ambiguous repeated filter values
- Treated a blank search as no search filter
- Preserved all existing valid query behavior
- Confirmed thirty-two total tests passed

## Validation Behavior

- completed=true becomes the Boolean true
- completed=false becomes the Boolean false
- completed=maybe returns 400
- Repeated completed values return 400
- Valid search text is trimmed and normalized
- Repeated search values return 400
- Blank search text does not filter the collection

## Key Concepts

- Query strings are untrusted client input
- Query values should be validated before use
- Query values may not always be strings
- Validation middleware can normalize input
- Normalized values can be attached to the request
- Route handlers can rely on middleware guarantees
- Ambiguous input should not be silently interpreted
- Validation should occur before filtering
- Existing automated tests protect valid behavior during changes

## Verification

- Ran npm test without starting server.js
- Confirmed valid completed filters still worked
- Confirmed invalid completed values returned 400
- Confirmed repeated completed values returned 400
- Confirmed search remained case-insensitive
- Confirmed search whitespace was trimmed
- Confirmed repeated search values returned 400
- Confirmed blank search returned the complete collection
- Confirmed existing CRUD tests still passed
- Confirmed thirty-two tests passed
- Ran the suite more than once with the same result

## Explanation From Memory

Query-string values are controlled by the client and cannot be assumed to have the expected type or value. The validateTaskQuery middleware validates completed and search before the collection handler runs. It converts valid completed strings into booleans, normalizes valid search text, and attaches the resulting values to req.taskFilters. Invalid or ambiguous values receive a 400 response.
