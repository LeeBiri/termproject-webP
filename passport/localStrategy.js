const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User"); // 사용자 모델

module.exports = (passport) => {
	passport.use(
		new LocalStrategy(
			{ usernameField: "email", passwordField: "password" }, // 인증 필드 정의
			async (email, password, done) => {
				try {
					// 사용자 이메일로 조회
					const user = await User.findOne({ email });
					if (!user) {
						return done(null, false, { message: "존재하지 않는 사용자입니다." });
					}

					// 비밀번호 비교
					const isMatch = await bcrypt.compare(password, user.password);
					if (!isMatch) {
						return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
					}

					// 인증 성공
					return done(null, user);
				} catch (error) {
					return done(error);
				}
			}
		)
	);
};
