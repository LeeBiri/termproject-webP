const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("MongoDB 연결 성공");
	} catch (error) {
		console.error("MongoDB 연결 실패:", error);
		process.exit(1); // 연결 실패 시 애플리케이션 종료
	}
};

module.exports = connectDB;