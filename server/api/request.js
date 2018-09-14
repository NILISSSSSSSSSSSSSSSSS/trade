import { Router } from 'express'
const request = require('superagent')
const router = Router()

router.get('/requestWithToken', (req, res, next) => {
  res.json({token: 'my'})
})

export default router
