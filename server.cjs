const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');

const server = http.createServer((req, res) => {

  let url;
  if(req.url == '/') {
    url = 'index.html';
  }
  else {
    url = req.url;
  }

  // Get the file path from the request URL
  const filePath = path.join(__dirname, 'server', url);

  console.log(filePath);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file doesn't exist, return a 404 error
      res.statusCode = 404;
      res.end('File not found');
      return;
    }

    // If the file exists, read its contents and serve it with the correct MIME type
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error reading file');
        return;
      }
      console.log(mime);
      const contentType = mime.getType(filePath) || 'text/plain';
      res.setHeader('Content-Type', contentType);
      res.statusCode = 200;
      res.end(data);
    });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
