import { Router } from 'https://deno.land/x/oak/mod.ts'
import {addGoal, deleteGoal, getGoal, getGoals, updateGoal} from '../controllers/goals.ts'

const router = new Router()

// READ
router.get('/', async ctx => await getGoals(ctx))

// READ - Single goal
router.get('/goal/:id', async ctx => await getGoal(ctx))

// CREATE
router.post('/add-goal', async ctx => await addGoal(ctx))

// UPDATE
router.post('/update-goal', async ctx => await updateGoal(ctx))

// DELETE
router.post('/goal/:id', async ctx => await deleteGoal(ctx))

export default router
