const express = require('express')
const app = express()
const port = 3000

//goods에 있는 router 파일을 가져옴
const goodsRouter = require('./routes/goods');

app.get('/goods/list', (req, res) => {
    res.send('상품 목록 페이지')
  })
  
  app.get('/goods/detail', (req, res) => {
    res.send('상품 상세 페이지')
  })
  
  app.get('/user/login', (req, res) => {
    res.send('로그인 페이지')
  })
  
  app.get('/user/register', (req, res) => {
    res.send('회원가입 페이지')
  })

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

