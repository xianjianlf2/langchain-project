import Koa from 'koa'
import { koaBody } from 'koa-body'
import Router from 'koa-router'
import { chat } from './chat.ts'

const app = new Koa()

app.use(
  koaBody({
    multipart: true
  })
)

const router = new Router()
router.get('/', (ctx) => {
  ctx.body = 'hello server'
})

router.post('/chat', async (ctx) => {
  const res = await chat(ctx)
  ctx.body = {
    data: res,
    state: 1
  }
})

app.use(router.routes())

app.listen(8888, () => {
  console.log('open server http://localhost:8888')
})
