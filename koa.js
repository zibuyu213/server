const Koa = require('koa');
const app = new Koa();
const koarouter = require('koa-router');
const router = koarouter();

const aaa = require('./fs');


app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8000');
  await next();
 });
router.get('/weishou', aaa.getFile);

app.use(router.routes());

app.listen(3000);
