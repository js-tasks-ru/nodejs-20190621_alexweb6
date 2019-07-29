const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const limitSizeStream = require('./LimitSizeStream');


const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const dirname = __dirname+'/files';
  const filepath = path.join(__dirname, 'files', pathname);



  switch (req.method) {
    case 'POST':

      //Проверить отсутствие вложенности
      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end();
      }

      //Создать стрим для записи
      const fileOut = fs.createWriteStream(filepath,{flags: 'wx'});

      //Создать стрим для ограничения лимита
      const limitStream = new limitSizeStream({limit: 1000000});

      //Пропускаем тело запроса через limitStream и вешаем обработчик ошибки
      req.pipe(limitStream).pipe(fileOut);

      //Обработать ошибку если пытаются перезаписать файл
      fileOut.on('error', err => {

          if (err.code === 'EEXIST') {
              res.statusCode = 409;
              res.end('File exist');
          }

      });

      //Слишком большой файл
      limitStream.on('error', () => {

          res.statusCode = 413;
          res.end('Size limited');
          fs.unlink(filepath, () => {});

      });

      //Обработать успешный файл
      fileOut.on('close', () => {
          res.statusCode = 201;
          res.end('Success');
      });

      //Обрыв соединения
      res.on('close', () => {
          if (!res.finished) {
              fs.unlink(filepath, () => {});
              res.end();
          }
      });


      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }




});



module.exports = server;


