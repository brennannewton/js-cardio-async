/*
 * controller.js
 * Brennan Newton
 * Handles requests from the router
 */

const db = require(`./db`);
const fs = require(`fs`).promises;

/**
 * Returns 404 file if request not found
 * @param {object} request
 * @param {object} response
 */
exports.notFound = async (request, response) => {
  const html = await fs.readFile(`404.html`);
  response.writeHead(404, { 'Content-type': 'text/html' });
  response.end(html);
};

/**
 * Gets the home page
 * @param {object} request
 * @param {object} response
 */
exports.getHome = (request, response) => {
  response.writeHead(200, { 'My-custom-header': 'This is a great API' });
  response.end('Welcome to my server');
};

/**
 * Gets the status object
 * @param {object} request
 * @param {object} response
 */
exports.getStatus = (request, response) => {
  const status = {
    up: true,
    owner: 'Brennan Newton',
    timestamp: Date.now(),
  };
  response.writeHead(200, { 'Content-type': 'application/json' });
  response.end(JSON.stringify(status));
};

/**
 * Sets object[key] = value in a specified file
 * Returns error if file does not exist or invalid argument
 * @param {object} request
 * @param {object} response
 * @param {string} file  Name of the file from query
 * @param {string} key   Name of the key from query
 * @param {string} value Name of the value from query
 */
exports.patchSet = (request, response, { file, key, value }) => {
  if (!file || !key || !value) {
    response.writeHead(400);
    return response.end();
  }
  db.set(file, key, value)
    .then(() => {
      response.writeHead(200);
      response.end('Value set');
    })
    .catch(err => {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      response.end(err.message);
    });
};

/**
 * Writes body data to a specified file
 * Returns error if file aready exists
 * @param {object} request
 * @param {object} response
 * @param {string} pathname Path following the inital slash, which should include filename
 */
exports.postWrite = (request, response, pathname) => {
  // Get body data from request
  const data = [];
  request.on('data', chunk => data.push(chunk));
  request.on('end', async () => {
    const body = JSON.parse(data);
    // Call db to create file
    try {
      await db.createFile(pathname.split('/')[2], body);
      // Return response
      response.writeHead(201, { 'Content-type': 'text/html' });
      response.end('File written');
    } catch (err) {
      response.writeHead(400, { 'Content-type': 'text/html' });
      response.end(err.message);
    }
  });
};

/**
 * Retrieves contents of a file or value at a specific key
 * Returns error if file does not exist or invalid key
 * @param {object} request
 * @param {object} response
 * @param {string} pathname Path following the inital slash
 * @param {string} [key]    Name of the key from query
 */
exports.getGet = async (request, response, pathname, { key }) => {
  try {
    const fileOrVal = await db.get(pathname.split('/')[2], key);
    response.writeHead(200, { 'Content-type': 'text/html' });
    response.end(fileOrVal);
  } catch (err) {
    response.writeHead(400, { 'Content-type': 'text/html' });
    response.end(err.message);
  }
};

/**
 * Removes a key-value pair from the specified file
 * Returns error if file does not exist or invalid key
 * @param {object} request
 * @param {object} response
 * @param {string} file Name of the file from query
 * @param {string} key  Name of the key from query
 */
exports.patchRemove = async (request, response, { file, key }) => {
  try {
    await db.remove(file, key);
    response.writeHead(200, { 'Content-type': 'text/html' });
    response.end('Value removed');
  } catch (err) {
    response.writeHead(400, { 'Content-type': 'text/html' });
    response.end(err.message);
  }
};

/**
 * Deletes a specified file
 * Returns error if file does not exist
 * @param {object} request
 * @param {object} response
 * @param {string} pathname Path following the inital slash
 */
exports.deleteDeleteFile = async (request, response, pathname) => {
  try {
    await db.deleteFile(pathname.split('/')[2]);
    response.writeHead(200, { 'Content-type': 'text/html' });
    response.end('File deleted');
  } catch (err) {
    response.writeHead(400, { 'Content-type': 'text/html' });
    response.end(err.message);
  }
};

/**
 * Merges all the files in the database
 * @param {object} request
 * @param {object} response
 */
exports.postMerge = async (request, response) => {
  try {
    await db.mergeData();
    response.writeHead(200, { 'Content-type': 'text/html' });
    response.end('Files merged');
  } catch (err) {
    response.writeHead(400, { 'Content-type': 'text/html' });
    response.end(err.message);
  }
};
