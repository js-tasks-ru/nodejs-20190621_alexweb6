const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'GET':
        if (pathname.split('/').length > 1) {
            res.statusCode = 400;
            res.end('Вложенность не поддерживается');
        } else if (fs.existsSync(filepath) && req.url != '/') {
            const fileStream = fs.createReadStream(filepath);
            fileStream.pipe(res);
        } else if (!fs.existsSync(filepath)) {
            res.statusCode = 404;
            res.end();
        }

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }

    // res.on('close', () => {
    //
    //     if (res.finished == false) {
    //         new Error('Обрыв соединения');
    //     }
    //
    // });


});

module.exports = server;
