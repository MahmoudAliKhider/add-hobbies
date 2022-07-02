const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { UserEntity } = require("../models/user");
const express = require("express");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await UserEntity.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password!");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password!");

  res.send(user.generateAuthToken());
});

function validate(req) {
  const schema = {
    email: Joi.string().min(0).max(255).email().required(),
    password: Joi.string()
      .min(5)
      .max(255)
      // .message("Password is not complex enough!") //I should give a meaning full error message
      .required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
