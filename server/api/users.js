import { Router } from 'express'
const request = require('superagent')
const router = Router()

// Mock Users
const users = [
  { name: 'Alexandre' },
  { name: 'Pooya' },
  { name: 'Sébastien' }
]

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.json(users)
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})

router.post('/login', function (req, res) {
  console.log('login server')
  // 后台验证用户信息，并返回token
  // request.post('https://www.otcex.io/users/signin')
  // .send({authMode: 'email',email: '2717710422@qq.com', passwd: '3acd0be86de7dcccdbf91b20f94a68cea535922d'})
  // .end((err, data)=>{
  //   let token = data.body.data.token
  //   console.log(data.body.data.token)
  //   // 把token存储到cookie中
  //   if (token) {
  //     res.cookie('token', token, {
  //       maxAge: 60000 * 60 * 24
  //     })
  //   }
  //   // 原封不动返回
  //   return res.json(data)
  // })
  let token = 'its my token'
  // 把token存储到cookie中
  if (token) {
    res.cookie('token', token, {
      maxAge: 60000 * 60 * 24
    })
  }
  // 原封不动返回
  return res.json({token: token})
})
export default router
