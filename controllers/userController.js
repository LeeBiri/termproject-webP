const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 회원가입
exports.registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ name, email, password: hashedPassword });

		await user.save();
		res.status(201).send({ message: "회원가입 완료", user });
	} catch (err) {
		res.status(400).send({ error: "회원가입 실패", details: err });
	}
};

// 로그인
exports.loginUser = async (req, res) => {
	console.log("로그인 요청 수신:", req.body);
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(400).send({ error: "이메일 또는 비밀번호가 잘못되었습니다." });
		}

		const token = jwt.sign({ id: user._id }, "secretKey", { expiresIn: "1h" });
		res.status(200).send({ message: "로그인 성공", token });
	} catch (err) {
		res.status(500).send({ error: "로그인 실패", details: err });
	}
};
