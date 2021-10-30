const { errorLog, appLog } = require("./util");
const express = require("express");
const expressHandlebars = require("express-handlebars");
const app = express();
const port = process.env.PORT || 3000;

// 핸들바 뷰 엔진 설정
app.engine(".hbs", expressHandlebars({
  defaultLayout: "main",
  extname: ".hbs",
}))
app.set("view engine", ".hbs");


app.get("/", (req, res) => res.render("home"));

app.get("/about*", (req, res) => {
  res.render("about");
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