# Milestone 114 — Separate the Express App from the Server

## Completed

- Created src/app.js
- Moved Express application setup into app.js
- Moved middleware into app.js
- Moved in-memory task data into app.js
- Moved task lookup middleware into app.js
- Moved all API routes into app.js
- Moved unknown-route handling into app.js
- Moved centralized error handling into app.js
- Exported the configured Express application
- Reduced server.js to port configuration and app.listen()
- Confirmed importing app.js did not start the server
- Confirmed npm run dev still started the API
- Confirmed existing API behavior remained unchanged

## Project Structure

src/
app.js
server.js

## File Responsibilities

### app.js

- Creates the Express application
- Registers middleware
- Stores temporary in-memory task data
- Defines API routes
- Handles unknown routes
- Handles centralized errors
- Exports the configured application

### server.js

- Reads the server port
- Imports the configured Express application
- Starts the HTTP listener

## Key Concepts

- A file should have a clear responsibility
- Application configuration and server startup are separate concerns
- ES modules allow code to be exported and imported
- Exporting the Express app makes it reusable
- Importing the app should not automatically start the server
- Middleware order must remain correct during a refactor
- A structural refactor should preserve existing behavior
- Separating the app from the listener prepares the project for testing

## Manual Tests

- Imported app.js without starting a server
- Started the API with npm run dev
- Confirmed the configured environment port worked
- Confirmed GET /health worked
- Confirmed GET /api/tasks worked
- Confirmed GET /api/tasks/:id worked
- Confirmed query filtering worked
- Confirmed POST /api/tasks worked
- Confirmed PATCH /api/tasks/:id worked
- Confirmed DELETE /api/tasks/:id worked
- Confirmed missing resources still returned 404
- Confirmed unknown routes still returned JSON 404
- Confirmed malformed JSON still returned 400

## Explanation From Memory

The Express application and the network listener have different responsibilities. app.js creates and configures the application by registering middleware and routes, then exports it. server.js imports that application, reads the port configuration, and calls app.listen(). This allows other code, including future automated tests, to import the app without automatically starting a server.
