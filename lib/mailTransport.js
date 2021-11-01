const credentials = require("../credentials.development");
const nodemailer = require("nodemailer");
const { appLog } = require("../util");

const mailTransport = nodemailer.createTransport({
  auth: {
    user: credentials.sendgrid.user,
    pass: credentials.sendgrid.password,
  }
})

module.exports = () => {
  try {
    const result = await mailTransport.sendMail({
      from: "Madroak Travel <info@madroaktravel.com>",
      to: "some@test.com",
      subject: "Your Madroak travel tour",
      text: "Thank you for  booking your trip with Madroak travel. We look forward to your visit!",
    });
    appLog("mail send successfully: ", result);
  }
  catch (err) {
    appLog("could not send mail: ", err.message);
  }
}