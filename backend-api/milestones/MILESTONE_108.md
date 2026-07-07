# Milestone 108 — Stable Resource IDs

## Completed

- Identified the duplicate-ID risk in tasks.length + 1
- Created a nextTaskId counter
- Initialized the counter from the highest existing task ID
- Updated POST /api/tasks to use the counter
- Incremented the counter after assigning an ID
- Confirmed deleted IDs were not immediately reused
- Confirmed all remaining tasks had unique IDs

## Key Concepts

- Resource IDs must uniquely identify resources
- Array length is not a safe ID generator after deletion
- Deleting an item changes array length
- An incrementing counter avoids duplicate in-memory IDs
- A deleted ID does not need to be reused
- A database will eventually handle persistent ID generation
- In-memory counters reset when the server restarts

## Manual Tests

- Deleted task 2
- Created a new task and confirmed it received ID 4
- Created another task and confirmed it received ID 5
- Deleted task 4
- Created another task and confirmed it received ID 6
- Confirmed GET /api/tasks contained no duplicate IDs

## Explanation From Memory

Using tasks.length + 1 is unsafe because deleting an item reduces the array length and can cause an existing ID to be generated again. A separate nextTaskId counter increases whenever a task is created, so each new in-memory task receives a unique ID even after other tasks are deleted.