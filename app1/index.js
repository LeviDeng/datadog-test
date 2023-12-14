const tracer = require('dd-trace').init();
const logger = require('pino')('./info.log');

logger.error('test error');

const Koa = require('koa');
const app = new Koa();

// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
  
});

app.listen(3000);
