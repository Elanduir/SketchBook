const http = require('http');
const fs = require('fs').promises;

const host = 'localhost';
const port = 8080;

const requireListener = function(req, res) {
  fs.readFile("index.html").then(contents => {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(contents);
  })
};
const server = http.createServer(requireListener);
server.listen(port, host, () => {
  console.log('server is running on http://${host}:${port}');
});
