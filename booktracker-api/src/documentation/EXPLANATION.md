A request enters app.js. JSON parsing runs first, then request logging.
General routes are checked. Book requests go into bookRoutes.js.
Book route middleware validates parameters, queries, or bodies.
The controller runs after validation.
The controller calls bookStore.js to read or change data.
The controller sends the HTTP response.
If no route matches, notFoundHandler returns JSON 404.
If an error reaches the error pipeline, errorHandler returns safe JSON.
