const http = require(`http`);
const url = require(`url`);
const db = require(`./db`);

const server = http.createServer();

server.on('request', (request, response) => {
  if (request.url === '/' && request.method === 'GET') {
    response.writeHead(200, { 'My-custom-header': 'This is a great API' });
    response.end('Welcome to my server');
    return;
  }

  if (request.url === '/status' && request.method === 'GET') {
    const status = {
      up: true,
      owner: 'Brennan Newton',
      timestamp: Date.now(),
    };
    response.writeHead(200, { 'Content-type': 'application/json' });
    response.end(JSON.stringify(status));
  }

  const parsedUrl = url.parse(request.url, true);
  // console.log(parsedUrl);
  if (parsedUrl.pathname === '/set' && request.method === 'PATCH') {
    const q = parsedUrl.query;
    return db
      .set(q.file, q.key, q.value)
      .then(() => {
        response.end('Value set');
      })
      .catch(err => {
        // TODO: handle errors
      });
  }
});

server.listen(5000, () => console.log(`Server listening on port 5000`));
