const express = require('express');
const server = express();
const path = require('path');

let publicDir = path.join(__dirname, 'client');

server.use(express.static(publicDir));

server.get('/', function(req, res) {
  res.sendFile(path.join(publicDir, '/index.html'));
});

server.listen(3000, () => console.log('Example server listening on port 3000!'));