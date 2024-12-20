const mongoose = require('mongoose');

const MeteorObservationSchema = new mongoose.Schema({
    beginningUtcTime: { type: Date, required: true }, // 유성이 발생한 UTC 시간
    latitude: { type: Number, required: true }, // 시작된 북위
    longitude: { type: Number, required: true }, // 시작된 동경
    showerIAUNo: { type: Number, required: true }, // 유성우의 IAU 번호
    solLonDeg: { type: Number }, // 태양의 경도
    vgeoKmS: { type: Number }, // 지구에서의 속도
    durationSec: { type: Number }, // 유성의 지속 시간
    peakAbsMag: { type: Number }, // 최고 절대 밝기
    stationCode: { type: String, required: true }, // 관측소 코드
    showerIAUCode: { type: String, required: true }, // 유성우 코드
    showerIAUName: { type: String, required: true }, // 유성우 이름
});

const MeteorObservation = mongoose.model('MeteorObservation', MeteorObservationSchema);
module.exports = MeteorObservation;
