const jwt = require("jsonwebtoken");

const secretKey = "secretKey";

exports.generateToken = (userId) => {
	return jwt.sign({ id: userId }, secretKey, { expiresIn: "1h" });
};

exports.verifyToken = (token) => {
	return jwt.verify(token, secretKey);
};
