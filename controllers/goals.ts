import { RouterContext, Status, HttpError } from 'https://deno.land/x/oak/mod.ts'
import { renderFileToString } from 'https://deno.land/x/dejs/mod.ts'
import Goal from '../models/goal.ts'

let goals: Goal[] = []

export async function getGoals(ctx: RouterContext) {
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/goals.ejs`, {
    title: 'All Goals',
    goals
  })
  // ctx.response.type = 'text/html'
}

export async function getGoal(ctx: RouterContext) {
  const goal = goals.find(goal => goal.id === ctx.params.id)
  if(!goal) throw new Error('No goal found')
  ctx.response.body = await renderFileToString(`${Deno.cwd()}/views/goal.ejs`, {
    goal
  })
}

export async function addGoal(ctx: RouterContext) {
  const body = await ctx.request.body()
  const name = (await body.value).get('new-goal')
  if(name.trim().length === 0) return ctx.response.redirect('/')
  goals.push(new Goal(name))
  ctx.response.redirect('/')
}

export async function updateGoal(ctx: RouterContext) {
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
}

export async function deleteGoal(ctx: RouterContext) {
  const id = ctx.params.id
  goals = goals.filter(goal => goal.id !== id)
  ctx.response.redirect('/')
}