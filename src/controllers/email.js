const tcWrapper = require("../utils/reusableTryCatch");
const { ErrorHandler } = require("../utils/error");
const sendEmail = require("../utils/email");

exports.sendMail = tcWrapper(async (req, res, next) => {
  try {
    const data = req.body;

    //console.log("controllers/email/sendMail", data);

    res.status(200).json({
      status: "success",
      message: "Temprorarily deactivated, contact developer. "
    });

    // sendEmail(data);

    // res.status(200).json({
    //   status: "success",
    //   message: "Message Sent"
    // });
  } catch (err) {
    console.log(err);
    return next(
      new ErrorHandler(
        500,
        "Email could not be sent, please use the Chat widget."
      )
    );
  }
});
