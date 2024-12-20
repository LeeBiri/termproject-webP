// 기본 라이브러리 및 설정
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const favicon = require("serve-favicon");

// 환경 변수 로드
dotenv.config();

const userRouter = require("./routes/userRoutes"); // 사용자 라우터
const cometsRouter = require("./routes/comets");
const meteorShowerRouter = require("./routes/meteorShower");
const predictEventsRouter = require("./routes/predictEvents");

const passportConfig = require("./passport");

const app = express();

passportConfig();

// 애플리케이션 설정
app.set("port", process.env.PORT || 3000); // 포트 설정

// MongoDB 연결
connectDB();

// 미들웨어 설정
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET,
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());

// 라우터 등록
app.use("/users", userRouter);
app.use((req, res, next) => {
	console.log(`요청: ${req.method} ${req.url}`);
	next();
});
app.use("/comets", cometsRouter);
app.use("/meteor-showers", meteorShowerRouter);
app.use("/predict-events", predictEventsRouter);
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

// 404 에러 처리 미들웨어
app.use((req, res, next) => {
	const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
	error.status = 404;
	next(error);
});

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
	res.locals.message = err.message;
	res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
	res.status(err.status || 500);
	res.json({ error: res.locals.message });
});

// 서버 실행
app.listen(app.get("port"), () => {
	console.log(`${app.get("port")} 에서 대기중`);
});
