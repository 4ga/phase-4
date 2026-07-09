# Milestone 128 — Unit Tests for the Task Store

## Completed

- Created test/taskStore.test.js
- Imported task-store functions directly
- Reset store state before every unit test
- Tested the initial task collection
- Tested collection copy protection
- Tested single-task copy protection
- Tested missing-task lookup
- Tested task creation
- Tested increasing ID generation
- Tested task updates
- Tested missing-task updates
- Tested task deletion
- Tested missing-task deletion
- Tested record and ID restoration through resetTasks
- Preserved all existing API tests
- Confirmed sixty-four total tests passed

## Store Unit-Test Coverage

- getAllTasks returns the initial records
- getAllTasks returns a new array and copied objects
- getTaskById returns a copied task
- getTaskById returns undefined for a missing task
- createTaskRecord stores a new task
- createTaskRecord assigns increasing IDs
- updateTaskRecord persists valid updates
- updateTaskRecord returns undefined for a missing task
- deleteTaskRecord removes an existing task
- deleteTaskRecord returns false for a missing task
- resetTasks restores records and the next ID

## Key Concepts

- Unit tests exercise one module directly
- API tests protect HTTP behavior
- Store tests protect data-access behavior
- Tests should cover successful and missing-record cases
- Returning copies protects private module state
- Store functions return JavaScript results rather than HTTP responses
- Controllers translate store results into HTTP behavior
- beforeEach provides predictable test state
- Related counters must be reset with stored records

## Verification

- Ran npm test without starting server.js
- Confirmed all fifty-six API tests still passed
- Confirmed eight task-store unit tests passed
- Confirmed outside array mutation did not change stored records
- Confirmed outside object mutation did not change stored records
- Confirmed creation generated IDs 4 and 5
- Confirmed updates persisted
- Confirmed deletion removed only the requested task
- Confirmed resetTasks restored the original records
- Confirmed resetTasks restored the next ID to 4
- Confirmed sixty-four tests passed

## Explanation From Memory

Store unit tests call the data functions directly without using HTTP or
Supertest. They verify that records can be read, created, updated, and
deleted and that missing records return appropriate JavaScript results.
They also prove that the store returns copies rather than exposing its
private array and objects. API tests and store tests protect different
boundaries and work together.
