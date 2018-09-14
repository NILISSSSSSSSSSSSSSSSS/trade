import { Router } from 'express'

import users from './users'
import request from './request'

const router = Router()

// Add USERS Routes
router.use(users, request)

export default router
