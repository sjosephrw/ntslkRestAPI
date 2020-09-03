const bcrypt = require("bcryptjs");
const xss = require("xss");

//utils
const { ErrorHandler } = require("../utils/error");
const { createJWTToken } = require("../utils/jwt");

//models
const User = require("../models/user");

exports.signup = async (req, res, next) => {

  let { email, password, passwordConfirm } = req.body;

  xss(email);
  xss(password);
  xss(passwordConfirm);  

  try {
    const newUser = await User.create({
      email: email,
      password: password,
      passwordConfirm: passwordConfirm
    });

    const user = await User.findById({ _id: newUser._id });

    res.status(201).json({
      status: "success",
      message: "You have been registered, please Login!",
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.signin = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    xss(email);
    xss(password);

    if (!email || !password)
      return next(
        new ErrorHandler(400, "Please provide a email and password!.")
      );

    //0.1 get email of user
    const user = await User.findOne({ email: email }).select(
      "email password role"
    );
    if (!user)
      return next(new ErrorHandler(401, "Invalid username or password"));

    // console.log(user)

    //check whether password is valid
    // As of bcryptjs 2.4.0, compare returns a promise if callback is omitted:
    const result = await bcrypt.compare(password, user.password);
    if (!result)
      return next(new ErrorHandler(401, "Invalid username or password"));

    //https://stackoverflow.com/questions/48197334/cant-use-delete-operator-on-mongoose-query-results
    //https://stackoverflow.com/a/48197599
    //http://mongoosejs.com/docs/api.html#document_Document-toObject
    const newUserObj = user.toObject();
    delete newUserObj.password; //remove the password from the user object so that the response obj. does not display it
    //2. send token
    const token = createJWTToken(user._id);

    res.status(200).json({
      status: "success",
      message: "You are now logged in, Redirecting in 3 Seconds!",
      token,
      data: {
        user: newUserObj
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.accessLevel = (...roles) => {
  return (req, res, next) => {
    //if the roles array does not include the current users role then do not give access
    //console.log(req.user)

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(403, "You are not authorized to perform this action.")
      ); //403 - forbidden
    }

    next(); //sends us back to the next route handler.
  };
};
