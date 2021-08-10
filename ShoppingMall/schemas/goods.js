const mongoose = require("mongoose");

// 스키마를 만든다.
const { Schema } = mongoose;

const goodsSchema = new Schema({
  goodsId: {
    type: Number,
    required: true, //꼭 필요한 정보인가
    unique: true  // unique 옵션
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  thumbnailUrl: {
    type: String
  },
  category: {
    type: String
  },
  price: {
    type: Number
  }
});

//모델링해서 내보낸다.
module.exports = mongoose.model("Goods", goodsSchema);