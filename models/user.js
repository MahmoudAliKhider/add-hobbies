const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 0,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    length: 12,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.JWTPRIVATEKEY
  );
};

const UserEntity = mongoose.model("User", userSchema);

function validateAgainstErrors(user) {
  const scheme = {
    firstName: Joi.string().min(0).max(255).required(),
    lastName: Joi.string().min(0).max(255).required(),
    email: Joi.string().min(0).max(255).email().required(),
    phoneNumber: Joi.string()
      .length(11)
      .regex(/^01[0125][0-9]{8}$/gm)
      // .message("That's not a valid Egyption Phone number!") //I should give a meaning full error message
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .regex(/^(?=.*d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
      // .message("Password is not complex enough!") //I should give a meaning full error message
      .required(),
  };

  return Joi.validate(user, scheme);
}

exports.UserEntity = UserEntity;
exports.validate = validateAgainstErrors;
