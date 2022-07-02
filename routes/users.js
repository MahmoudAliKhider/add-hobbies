const auth = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { UserEntity, validate } = require("../models/user");
const express = require("express");

const router = express.Router();

router.get("/me", auth, async (req, res) =>
  res.send(await UserEntity.findById(req.user._id).select("-password"))
);

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await UserEntity.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new UserEntity(
    _.pick(req.body, [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "password",
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  res
    .header("x-auth-token", user.generateAuthToken())
    .send(
      _.pick(user, ["_id", "firstName", "lastName", "phoneNumber", "email"])
    );
});

module.exports = router;
