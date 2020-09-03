const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: true,
    lowercase: true,
    maxlength: 70,
    minlength: 7,
    validate: [validator.isEmail, "Invalid email entered."]
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    maxlength: 50,
    minlength: 7,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password."],
    maxlength: 50,
    minlength: 7,
    validate: {
      //only works on SAVE, CREATE and not UPDATE, so will have to use save for updating as well.
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords do not match!."
    },
    select: false
  },
  role: {
    type: String,
    enum: ["user", "admin", "root"],
    default: "user"
  },
  passwordResetToken: String,
  passwordResetExpires: Date
});
//https://stackoverflow.com/questions/48799894/trying-to-hash-a-password-using-bcrypt-inside-an-async-function
//pre save doc MW
//for saving and creating
userSchema.pre("save", async function() {
  if (this.isModified("password")) {
    //only if the password field is modified
    let user = this;

    const hashedPassword = await hashPassword(user);
    user.password = hashedPassword;
    user.passwordConfirm = undefined;
  }
  //https://mongoosejs.com/docs/middleware.html
  //In mongoose 5.x, instead of calling next() manually, you can use a function that returns a promise. In particular, you can use async/await.
});

//https://stackoverflow.com/questions/48799894/trying-to-hash-a-password-using-bcrypt-inside-an-async-function
async function hashPassword(user) {
  const password = user.password;

  const hashedPassword = await new Promise((resolve, reject) => {
    //cryptr is for encrypting passwords bcryptjs is for hashing only
    bcrypt.genSalt(8, function(err, salt) {
      if (err) reject(err);

      bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
        if (err) reject(err);
        resolve(hash);
      });
    });
  });

  return hashedPassword;
}

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  //encrypting the reset token
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  //setting the token expiry time
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 min in miliseconds
  console.log({ resetToken }, this.passwordResetToken);
  return resetToken; //to send by email
};

//https://stackoverflow.com/questions/55696324/how-to-hide-a-field-in-the-callback-of-document-save-in-mongoose
//hiding the password and confirm password after saving in DB, using post save MW
userSchema.post("save", function(doc) {
  delete doc.password;
  delete doc.passwordConfirm;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
