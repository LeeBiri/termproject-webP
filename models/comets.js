const mongoose = require('mongoose');

const cometSchema = new mongoose.Schema({
    spkid: { type: Number, required: true }, // 고유 식별자
    full_name: { type: String, required: true }, // 전체 이름
    name: { type: String, required: true }, // 이름
    epoch: { type: Number, required: true }, // 에포크
    epoch_cal: { type: Date, required: true }, // 에포크 날짜
    e: { type: Number, required: true }, // 이심률
    a: { type: Number, required: true }, // 장반경
    q: { type: Number, required: true }, // 근일점
    i: { type: Number, required: true }, // 경사각
    om: { type: Number, required: true }, // 경도
    w: { type: Number, required: true }, // 아르구멘트
    ma: { type: Number, required: true }, // 평균 근일점
    n: { type: Number, required: true }, // 공전주기
    tp: { type: Number, required: true } // 다음 근일점
});

const Comets = mongoose.model('Comets', cometSchema);
module.exports = Comets;