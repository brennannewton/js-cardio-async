/*
 * router.js
 * Brennan Newton
 * Routes requests to the right destination
 */

const url = require(`url`);
const {
  notFound,
  getHome,
  getStatus,
  patchSet,
  postWrite,
  getGet,
  patchRemove,
  deleteDeleteFile,
  postMerge,
} = require(`./controller`);

const handleRoutes = (request, response) => {
  const { pathname, query } = url.parse(request.url, true);

  if (pathname === '/' && request.method === 'GET') {
    return getHome(request, response);
  }

  if (pathname === '/status' && request.method === 'GET') {
    return getStatus(request, response);
  }

  if (pathname === '/set' && request.method === 'PATCH') {
    return patchSet(request, response, query);
  }

  if (pathname.startsWith('/write') && request.method === 'POST') {
    return postWrite(request, response, pathname);
  }

  if (pathname.startsWith('/get') && request.method === 'GET') {
    return getGet(request, response, pathname, query);
  }

  if (pathname === '/remove' && request.method === 'PATCH') {
    return patchRemove(request, response, query);
  }

  if (pathname.startsWith('/deleteFile') && request.method === 'DELETE') {
    return deleteDeleteFile(request, response, pathname);
  }

  if (pathname === '/merge' && request.method === 'POST') {
    return postMerge(request, response);
  }

  return notFound(request, response);
};

module.exports = handleRoutes;
