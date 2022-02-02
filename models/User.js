const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      maxlength: 50,
      default: null,
    },
    last_name: {
      type: String,
      maxlength: 50,
      default: null,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide an email."],
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email.",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide a password."],
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedOn: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  {timestamps: true}
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  try {
    const isMatch = await bcrypt.compare(canditatePassword, this.password);
    return isMatch;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = mongoose.model("User", UserSchema);
