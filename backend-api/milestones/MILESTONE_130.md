# Milestone 130 — Request Body Safety for Non-JSON and Empty Bodies

## Completed

- Added a safe request-body helper
- Defensively handled missing request bodies
- Defensively handled null request bodies
- Defensively handled non-object request bodies
- Defensively handled array request bodies
- Updated create-task validation to use a safe body shape
- Updated update-task validation to use a safe body shape
- Preserved existing validation messages
- Preserved existing status codes
- Tested POST with no body
- Tested POST with a non-JSON body
- Tested PATCH with no body
- Tested PATCH with a non-JSON body
- Confirmed existing tests still passed
- Confirmed seventy-two tests passed

## Key Concepts

- Request bodies are untrusted client input
- Middleware should not assume req.body has a safe shape
- Missing or unsupported body shapes should produce validation errors
- Bad client input should return 400, not 500
- Validation middleware can normalize unsafe input before controllers run
- Defensive validation protects the request pipeline
- Existing response contracts should be preserved when hardening behavior

## Verification

- Ran npm test without starting server.js
- Confirmed POST with no body returned Title is required
- Confirmed POST with text/plain returned Title is required
- Confirmed PATCH with no body returned At least one field is required
- Confirmed PATCH with text/plain returned At least one field is required
- Confirmed malformed JSON still returned Invalid JSON body
- Confirmed existing CRUD, query, pagination, and store tests still passed
- Confirmed seventy-two tests passed

## Explanation From Memory

Request bodies come from the client and may be missing, malformed, or not
parsed as JSON. The validation middleware uses a helper to safely treat
missing or unsafe body shapes as an empty object. This lets the existing
validation rules return predictable 400 responses instead of allowing the
server to crash with an unexpected 500 error.
