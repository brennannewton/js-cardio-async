/*
 * server.js
 * Brennan Newton
 * Opens a server & sends requests to the router
 */

// Import node modules
const http = require(`http`);
const handleRoutes = require(`./router`);

// Instantiate server
const server = http.createServer();

// Handle events
server.on('request', handleRoutes);

// Open server for connections
server.listen(5000, () => console.log(`Server listening on port 5000`));
