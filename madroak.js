const { errorLog, appLog } = require("./util");
const express = require("express");
const expressHandlebars = require("express-handlebars");
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

app.get("/", (req, res) => res.render("home"));

app.get("/about*", (req, res) => {
  const fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
  ]

  res.render("about", {
    fortune: fortunes[~~(Math.random() * fortunes.length)],
  });
})

// 404
app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
})

// 500
app.use((err, req, res, next) => {
  errorLog(err.message);
  res.type("text/plain");
  res.status(500);
  res.send("500 - Server Error");
})

app.listen(port, (req) => {
  appLog(`Express started on port ${port}`)
})