const { appLog } = require("./util");
const express = require("express");
const expressHandlebars = require("express-handlebars");
const weatherMiddleware = require("./lib/middleware/weather");
const handlers = require("./lib/handlers");
const app = express();
const port = process.env.PORT || 3000;
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
// x-powered-by 정보 은닉
app.disable("x-powered-by");

app.get("/", handlers.home);

app.get("/about*", handlers.about)

app.get("/newsletter", handlers.newsletter);

app.post("/api/newsletter-signup", handlers.api.newsletterSignup);

app.get("/newsletter-signup", handlers.newsletterSignup);

app.post("/newsletter-signup/process", handlers.newsletterSignupProcess);

app.get("/newsletter-signup/thank-you", handlers.newsletterSignupThankYou);

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