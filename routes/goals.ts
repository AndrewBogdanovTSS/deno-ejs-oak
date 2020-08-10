import { Router, Status, HttpError } from 'https://deno.land/x/oak/mod.ts'
import { renderFileToString } from 'https://deno.land/x/dejs/mod.ts'
import Goal from '../models/goal.ts'

const router = new Router()
let goals: Goal[] = []

// READ
router.get('/', async (ctx) => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/goals.ejs`, {
    title: 'All Goals',
    goals
  })
  // ctx.response.type = 'text/html'
})

// READ - Single goal
router.get('/goal/:id', async ctx => {
  const goal = goals.find(goal => goal.id === ctx.params.id)
  if(!goal) throw new Error('No goal found')
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/goal.ejs`, {
    goal
  })
})

// CREATE
router.post('/add-goal', async ctx => {
  const body = await ctx.request.body()
  const name = (await body.value).get('new-goal')
  if(name.trim().length === 0) return ctx.response.redirect('/')
  goals.push(new Goal(name))
  ctx.response.redirect('/')
})

// UPDATE
router.post('/update-goal', async ctx => {
  const body = await ctx.request.body()
  const name = (await body.value).get('name')
  const id = (await body.value).get('id')
  if(name.trim().length === 0) {
    return ctx.response.redirect('/')
  }
  const goal = goals.find(goal => goal.id === id)
  if(goal) goal.update(name)
  else {
    const error = new HttpError()
    error.status = Status.NotFound
    throw error
  }
  console.log('goals:', goals)
  ctx.response.redirect('/')
})

router.post('/goal/:id', ctx => {
  const id = ctx.params.id
  goals = goals.filter(goal => goal.id !== id)
  ctx.response.redirect('/')
})

export default router
