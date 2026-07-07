# Milestone 113 — Environment Variables and Local Configuration

## Completed

- Replaced the hard-coded server port
- Read PORT from process.env
- Converted the environment-variable value into a number
- Added port 3000 as a fallback
- Created a local .env file
- Created a committed .env.example template
- Added .env to .gitignore
- Added an npm development script using Node's --env-file option
- Confirmed the server used the port from .env
- Confirmed the port could change without editing JavaScript
- Confirmed the fallback port worked without loading .env
- Confirmed Git ignored the local .env file

## Key Concepts

- Environment variables keep configuration outside source code
- Node exposes environment variables through process.env
- Environment-variable values are strings
- Numeric configuration may require explicit conversion
- A fallback provides a reasonable local default
- .env stores local environment values
- .env should not be committed
- .env.example documents required variables safely
- npm scripts can start an application in different ways
- Configuration changes should not require source-code changes

## Manual Tests

- Ran npm run dev with PORT=4000
- Confirmed the server listened on port 4000
- Changed .env to PORT=4500
- Confirmed the server listened on port 4500
- Ran npm start without loading .env
- Confirmed the fallback port worked
- Ran git check-ignore .env
- Confirmed .env did not appear as untracked in git status
- Confirmed existing API routes still worked

## Explanation From Memory

Environment variables allow configuration to be supplied outside the application source code. Node exposes them through process.env. For local development, Node can load values from a .env file. The local .env file is ignored by Git because environment files may contain private configuration. A committed .env.example file documents the variables the project expects without sharing real values.
