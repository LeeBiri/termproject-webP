const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController"); // 컨트롤러 임포트
const path = require("path");

const router = express.Router();

// 회원가입
router.post("/register", registerUser);

// 로그인
router.post("/login", loginUser);

router.get("/main", (req, res) => {
	res.sendFile(path.join(__dirname, "../public/main.html"));
});
module.exports = router;
