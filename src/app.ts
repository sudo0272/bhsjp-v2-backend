import koa from 'koa';

const app = new koa()
const port = 8000

app.use(ctx => {
  ctx.body = "Hello World!"
})

app.listen(port, () => {
  console.log("Server running on " + port)
})

