import { Application, send, isHttpError, Status } from 'https://deno.land/x/oak/mod.ts'
import { renderFileToString } from 'https://deno.land/x/dejs/mod.ts'
import router from './routes/goals.ts'

const app = new Application()

/*app.use(async (ctx, next) => {
  console.log('First middleware')
  await next()
})*/

// Error handler
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    if(isHttpError(e) && e.status === Status.NotFound) {
      ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/404.ejs`, {})
    } else {
      ctx.response.body = 'Ooops, something went wrong!'
    }
  }
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(async ctx => {
  await send(ctx, ctx.request.url.pathname, {root: 'static'})
})

/*app.use(async (ctx:any, next) => {
  console.log('Hello World!1')
  ctx.response.body = 'Hello World!'
  await next()
  console.log('after')
})

app.use((ctx:any) => {
  console.log('Hello World!2')
  ctx.response.body = 'Hello World!2'
})*/

await app.listen({port: 8000})
