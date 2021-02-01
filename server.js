const liveServer = require('live-server');
const { resolve } = require('path');

const resolvePath = (...path) => {
  return resolve(__dirname, ...path);
};
const outputPath = process.env.BUILD_PATH || './lib';
var params = {
  port: 8080, // Set the server port. Defaults to 8080.
  root: resolvePath(outputPath), // Set root directory that's being served. Defaults to cwd.
  file: 'index.html', // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
};
liveServer.start(params);
