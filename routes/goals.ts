import { Router } from 'https://deno.land/x/oak/mod.ts'
import { renderFileToString } from 'https://deno.land/x/dejs/mod.ts'

type Goal = {
  id: string,
  name: string
}

const goals: Goal[] = []
const router = new Router()

router.get('/', async ctx => {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/goals.ejs`, {
    title: 'All Goals',
    goals
  })
  // ctx.response.type = 'text/html'
})

router.post('/add-goal', async ctx => {
  const body = await ctx.request.body()
  const newGoalTitle = (await body.value).get('new-goal')
  if(newGoalTitle.trim().length === 0) {
    return ctx.response.redirect('/')
  }
  const newGoal = {id: new Date().toISOString(), name: newGoalTitle}
  console.log('newGoal:', newGoal)
  goals.push(newGoal)
  ctx.response.redirect('/')
})

export default router
