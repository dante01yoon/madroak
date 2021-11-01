const { appLog } = require("./util");
const express = require("express");
const multiparty = require("multiparty");
const cookieParser = require("cookie-parser");
const expressHandlebars = require("express-handlebars");
const weatherMiddleware = require("./lib/middleware/weather");
const handlers = require("./lib/handlers");
const requiresWaiver = require("./lib/tourRequiresWaiver");
const cartValidation = require("./lib/cartValidation");
const expressSession = require("express-session");
const morgan = require("morgan");
const fs = require("fs")
const credentials = require("./.credentials.development");
const app = express();
const port = process.env.PORT || 3000;

switch (app.get("env")) {
  case "development":
    app.use(morgan("dev"));
    break;
  case "production":
    const stream = fs.createWriteStream(__dirname + "/access.log",
      { flags: "a" });
    app.use(morgan("combined", { stream }));
    break;
}


// 정적 파일 세팅
app.use(express.static(__dirname + "/public"));
// body 읽어오기
app.use(express.urlencoded({ extended: true }));
// json 바디 분석
app.use(express.json());
// 핸들바 뷰 엔진 설정
app.engine(".hbs", expressHandlebars({
  defaultLayout: "main",
  extname: ".hbs",
}))
app.use(weatherMiddleware);
// 뷰 엔진
app.set("view engine", ".hbs");
// 세션 미들웨어 사용
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: credentials.cookieSecret,
}))
// 응답객체에서 쿠키 사용
app.use(cookieParser(credentials.cookieSecret));
// x-powered-by 정보 은닉
app.disable("x-powered-by");
//
app.use(requiresWaiver);
app.use(cartValidation.resetValidation);
app.use(cartValidation.checkWaivers);
app.use(cartValidation.checkGuestCounts);
app.get("/", handlers.home);

app.get("/about*", handlers.about)

app.get("/newsletter", handlers.newsletter);

app.post("/api/newsletter-signup", handlers.api.newsletterSignup);

app.get("/newsletter-signup", handlers.newsletterSignup);

app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);

app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);

app.get("/contest/vacation-photo", handlers.vacationPhoto)

app.post("/contest/vacation-photo/:year/:month", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    handlers.vacationPhotoContestProcess(req, res, fields, files);
  })
})

app.post("/api/vacation-photo-contest", handlers.api.vacationPhotoContest);

// 404
app.use(handlers.notFound)

// 500
app.use(handlers.serverError)

if (require.main === module) {
  app.listen(port, () => {
    appLog(`Express started on port ${port}`)
  })
} else {
  module.exports = app;
}