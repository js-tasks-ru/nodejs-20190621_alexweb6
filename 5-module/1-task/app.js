const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const clients = new Set();

router.get('/subscribe', async (ctx, next) => {

     const message = await new Promise(resolve => {
         clients.add(resolve);
     });

     ctx.body = message;

});

router.post('/publish', async (ctx, next) => {

    const message = ctx.request.body.message;

    if (!message) ctx.throw(400,'message is require');

    for (const client of clients) {
        client(message);
    }

    clients.clear();
    ctx.body = 'OK';

});

app.use(router.routes());

module.exports = app;
