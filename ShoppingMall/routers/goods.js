const express = require("express");
const Goods = require("../schemas/Goods");
const Cart = require("../schemas/cart");
const router = express.Router();

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

//Cart 데이터 추가
router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;
  console.log('quantity', quantity);

  isCart = await Cart.find({ goodsId }); // 카트에 있는지 조회
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

  const isGoodsInCart = await Cart.find({ goodsId});// goodsId로 찾는다.

  if(isGoodsInCart.length > 0){ //있으면 지운다.
    await Cart.deleteOne({ goodsId });
  }

  res.send({ result: "success"});
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