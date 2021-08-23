const express = require("express");
const Goods = require("../schemas/Goods");
const Cart = require("../schemas/cart");
const router = express.Router();

//goods.js 크롤링 라우터 만들기
const cheerio = require("cheerio");
const axios = require("axios");
const iconv = require("iconv-lite");
const url =
  "http://www.yes24.com/24/Category/BestSeller";

router.get("/goods/add/crawling", async (req, res) => {
  // 크롤링 대상 웨사이트 html 가져오기
  try {
    await axios({  // axios : node.js 서버에서 외부에 있는 특정 웹사이트 접근
      url: url,
      method: "GET", //api 호출방식
      responseType: "arraybuffer",  // 데이터를 받는 형식 ex) json
    }).then(async (html) => {
      //크롤링 코드
      const content = iconv.decode(html.data, "EUC-KR").toString();   // EUC-KR은 yes24에서 사용하는 인코딩 방식 ,한글이 안깨지도록 한다.
      //cheerio로 html 데이터 준비
      const $ = cheerio.load(content);
      const list = $("ol li"); //jquary 안에 있는 ol의 li를 리스트로 가져오겠다.
      await list.each(async (i, tag) => { // 리스트 반복문
        let desc = $(tag).find("p.copy a").text()  //책 소개     p.copy는 html에서 p태그 안의 copy라는 이름을 가진 클래스를 찾는다. 띄어쓰기는 child를 의미하고 a는 a태그를 의미한다.

        //<img src="http://image.yes24.com/goods/102789938/L" alt="달러구트 꿈 백화점 2"> 에서 src는 이미지 주소, alt는 책 이름을 가져온다.
        let image = $(tag).find("p.image a img").attr("src")
        let title = $(tag).find("p.image a img").attr("alt")
        let price = $(tag).find("p.price strong").text()

        if (desc && image && title && price) {   //데이터 있을때만 저장
          // goods schema에 goodsId 있어 따로 값을 부여해야한다, price는 string을 Number로 변환한다.
          price = price.slice(0, -1).replace(/(,)/g, "") // 12,420원 에서 slice를 이용해 '원'을 짜르고, ','를 빈 문자열로 바꿔 없애버린다.
          let date = new Date() // 밀리세컨까지 포함한 표준시를 숫자로 가져온다.
          let goodsId = date.getTime() // 표준시는 계속 변하니까 goodsId는 unique해진다. 그걸 goodsId로 사용한다.
          
          // 크롤링한 데이터를 mongoDB에 넣는다.
          await Goods.create({
            goodsId:goodsId,
            name:title,
            thumbnailUrl:image,
            category:"도서",
            price:price
          })
        }
      })
    });
    res.send({ result: "success", message: "크롤링이 완료 되었습니다." });

  } catch (error) {
    console.log(error)
    res.send({ result: "fail", message: "크롤링에 문제가 발생했습니다", error: error });
  }

});

// 상품 데이터 가져오기
router.get("/goods", async (req, res, next) => {
  try {
    const { category } = req.query; // category 쿼리에 있는 요소를 가져온다.
    const goods = await Goods.find({ category }).sort("-goodsId"); //goods를 가져와서 goodsId로 정렬한다.
    res.json({ goods: goods }); // 가져온 것들을 json으로 만든다.
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/goods/:goodsId", async (req, res) => { //"/goods/:goodsId" 는 /goods/변수 를 goodsId로 갖다 쓰겠다. 어떤 값이 오든 goodsId에 저장
  const { goodsId } = req.params;
  goods = await Goods.findOne({ goodsId: goodsId }); // findOne 하나만 가져온다.
  res.json({ detail: goods });
});

//상품 데이터 추가
router.post('/goods', async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  isExist = await Goods.find({ goodsId }); //같은 goodsId가 있는지 예외처리
  if (isExist.length == 0) {
    await Goods.create({ goodsId, name, thumbnailUrl, category, price });
  }
  res.send({ result: "success" });
});

//Cart 데이터 가져오기
router.get("/cart", async (req, res) => {
  const cart = await Cart.find({});
  const goodsId = cart.map(cart => cart.goodsId);

  goodsInCart = await Goods.find()
    .where("goodsId")
    .in(goodsId);

  concatCart = cart.map(c => {
    for (let i = 0; i < goodsInCart.length; i++) {
      if (goodsInCart[i].goodsId == c.goodsId) {
        return { quantity: c.quantity, goods: goodsInCart[i] };
      }
    }
  });

  res.json({
    cart: concatCart
  });
});

//Cart 데이터 mongodb에 추가
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  console.log('quantity', quantity)

  isCart = await Cart.find({ goodsId });
  console.log(isCart, quantity);
  if (isCart.length) {
    await Cart.updateOne({ goodsId }, { $set: { quantity } }); // 카트에 있으면 값을 갱신
  } else {
    await Cart.create({ goodsId: goodsId, quantity: quantity }); // 카트에 없으면 추가
  }
  res.send({ result: "success" });
});

//Cart delete     delete는 body를 쓰지 않는다.
router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const isGoodsInCart = await Cart.find({ goodsId });// goodsId로 찾는다.

  if (isGoodsInCart.length > 0) { //있으면 지운다.
    await Cart.deleteOne({ goodsId });
  }

  res.send({ result: "success" });
})

//장바구니에서 수량 수정
router.patch("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  isCart = await Cart.find({ goodsId });
  console.log(isCart, quantity);
  if (isCart.length) {
    await Cart.updateOne({ goodsId }, { $set: { quantity } });
  }

  res.send({ result: "success" });
})

module.exports = router;