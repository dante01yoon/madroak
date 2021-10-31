const fortune = require("./fortune");
const { errorLog, appLog } = require("../util");

exports.home = (req, res) => res.render("home");

exports.about = (req, res) => res.render("about", { fortune: fortune.getFortune() });

exports.notFound = (req, res) => {
  res.render("404")
};

exports.serverError = (err, req, res, next) => {
  errorLog(err);
  res
    .status(500)
    .render("500");
};

exports.processContact = (req, res) => {
  try {
    if (req.body.simulateError) throw new Error("error saving contact!");
    appLog(`received contact from ${req.body.name} <${req.body.email}>`);
    res.format({
      "text/html": () => res.redirect(303, "/thank-you"),
      "application/json": () => res.json({ success: true }),
    })
  }
  catch (err) {
    errorLog(`error processing contact from ${req.body.name} <${req.body.email}>`)
    res.format({
      "text/html": () => res.redirect(303, "/contact-error"),
      "application/json": () => res.status(500).json({
        error: "error saving contact information",
      })
    })
  }
}