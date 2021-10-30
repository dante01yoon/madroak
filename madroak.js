const express = require("express");
const { errorLog, appLog } = require("./util");
const app = express();
const port = process.env.PORT || 3000;

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