const fortune = require("./fortune");
const { errorLog, appLog } = require("../util");

exports.home = (req, res) => {
  req.session.userName = "Anonymous";
  const colorScheme = req.session.colorScheme || "dark"
  res.cookie("monster", "nom nom");
  res.cookie("signed_monster", "nom nom", { signed: true });
  res.render("home")
};

exports.about = (req, res) => res.render("about", { fortune: fortune.getFortune() });

exports.newsletter = (req, res) => {
  // CSRF
  res.render("newsletter", { csrf: "CSRF token goes here" });
}

exports.api = {
  newsletterSignup: (req, res) => {
    appLog("CSRF token (from hidden form field): ", req.body._csrf);
    appLog("Name (from visible form field): ", req.body.name);
    appLog("Email (from visible form field): ", req.body.email);
    res.send({ result: "success" });
  },
  vacationPhotoContest: (req, res, fields, files) => {
    appLog("req: ", req)
    appLog("res: ", res);
    appLog("field data: ", fields);
    appLog("files: ", files);
    res.send({ result: "success" })
  }
}

exports.newsletterSignup = (req, res) => {
  res.render("newsletter-signup", { csrf: "CSRF token goes here" })
}

exports.newsletterSignupProcess = (req, res) => {
  appLog("Form (from querystring): ", req.query.form);
  appLog("CSRF token (from hidden form field: ", req.body._csrf);
  appLog("Name (from visible form field): ", req.body.name);
  appLog("Email (from visible form field): ", req.body.email);
  res.redirect(303, "/newsletter-signup/thank-you");
}

exports.newsletterSignupThankYou = (req, res) => {
  res.render("newsletter-signup-thank-you");
}

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

exports.vacationPhoto = (req, res) => {
  res.render("contest/vacation-photo")
}

exports.vacationPhotoContestProcess = (req, res, fields, files) => {
  appLog("field data: ", fields);
  appLog("files: ", files);
  res.redirect(303, "/contest/vacation-photo-thank-you");
}
