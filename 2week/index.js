const express = require('express')
const app = express()
const port = 3000

// 경로(goods, user)에 있는 router 파일을 가져온다.
const goodsRouter = require('./routes/goods');
const userRouter = require('./routes/user')

// middleware로 url외에 다른 값들을 body로 가져온다.
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//static으로 정적파일(동영상, 이미지 등) 제공
app.use(express.static('public')) //public은 폴더명, http://localhost:3000/sample.png

// 경로(goods, user)가 들어오면 라우터로 goods 경로에 있는 파일을을 연결해준다.
app.use('/goods', goodsRouter)
app.use('/user', userRouter)


// app.get('/goods/list', (req, res) => {
//     res.send('상품 목록 페이지')
//   })

//   app.get('/goods/detail', (req, res) => {
//     res.send('상품 상세 페이지')
//   })

// app.get('/user/login', (req, res) => {
//   res.send('로그인 페이지')
// })

// app.get('/user/register', (req, res) => {
//   res.send('회원가입 페이지')
// })

// app.use((req, res, next) => {
//   console.log(req);  //request를 콘솔에 찍었다.
//   next();
// });

//ejs
app.set('views', __dirname + '/views'); //   /views가 경로
app.set('view engine', 'ejs'); //view engine으로 ejs사용하겠다.

app.get('/test', (req, res) => {  //test.ejs파일에 있는 것을 화면에 그린다.
  let name = req.query.name;
  res.render('test', { name }); // name이라는 객체를 넘겨준다.
}) // http://localhost:3000/test?name=bae   bae부분에 적은대로 화면에 나온다.

// root page
app.get('/', (req, res) => {
  res.send('<!DOCTYPE html>\
    <html lang="en">\
    <head>\
        <meta charset="UTF-8">\
        <meta http-equiv="X-UA-Compatible" content="IE=edge">\
        <meta name="viewport" content="width=device-width, initial-scale=1.0">\
        <title>Document</title>\
    </head>\
    <body>\
        Hi. I am with html<br>\
        <a href="/hi">Say Hi!</a>\
    </body>\
    </html>')
})

//ejs templete file
app.get('/home',(req, res, next)=>{ // http://localhost:3000/home
  res.render('index');  //ejs 파일
})

//homework detail 페이지 구현
app.get('/detail',(req, res, next)=>{ // http://localhost:3000/detail
  res.render('detail');
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

