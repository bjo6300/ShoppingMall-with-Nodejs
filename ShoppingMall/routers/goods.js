const express = require("express");
const Goods = require("../schemas/Goods");

const router = express.Router();

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

module.exports = router;