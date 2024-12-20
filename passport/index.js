const passport = require("passport");
const localStrategy = require("./localStrategy"); // LocalStrategy 설정
const User = require("../models/User"); // 사용자 모델

module.exports = () => {
	// Local Strategy 등록
	localStrategy(passport);

	// 사용자 직렬화
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// 사용자 역직렬화
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id);
			done(null, user);
		} catch (error) {
			done(error);
		}
	});
};
