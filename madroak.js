const { errorLog, appLog } = require("./util");
const express = require("express");
const expressHandlebars = require("express-handlebars");
const handlers = require("./lib/handlers");
const app = express();
const port = process.env.PORT || 3000;
// 정적 파일 세팅
app.use(express.static(__dirname + "/public"));
// 핸들바 뷰 엔진 설정
app.engine(".hbs", expressHandlebars({
  defaultLayout: "main",
  extname: ".hbs",
}))
app.set("view engine", ".hbs");

app.get("/", (req, res) => handlers.home);

app.get("/about*", (req, res) => handlers.about)

// 404
app.use((req, res) => handlers.notFound)

// 500
app.use((err, req, res, next) => handlers.serverError)

app.listen(port, (req) => {
  appLog(`Express started on port ${port}`)
})