const mongoose = require('mongoose');

const PredictEventSchema = new mongoose.Schema({
    date: { type: Date, required: true }, // 발생날짜
    eventName: { type: String, required: true }, // 천문 이벤트 종류
    latitude: { type: Number, required: true }, // 위도
    longitude: { type: Number, required: true }, // 경도
});

const PredictEvents = mongoose.model('PredictEvents', PredictEventSchema);
module.exports = PredictEvents;
