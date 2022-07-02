const admin = require("../middleware/adminMiddleware");
const auth = require("../middleware/authMiddleware");
const _ = require("lodash");
const { HobbyEntity, validate } = require("../models/hobby");
const express = require("express");

const router = express.Router();

//I know returning the whole object from DB it not ideal thing
//I must return a DTO it was Auto Mapper in .net Core
//I did not search for alternative for Node.js and Express
router.get("/", async (req, res) =>
  res.status(200).send(await HobbyEntity.find().sort("name"))
);

router.get("/search-by-name", async (req, res) => {
  const result = await HobbyEntity.find({
    name: req.query.search,
  });

  return !result
    ? res.status(404).send("No item found with this search key")
    : res.status(200).send(result);
});

router.get("/:id", async (req, res) => {
  const hobbyEntity = await HobbyEntity.findById(req.params.id);

  return !hobbyEntity
    ? res.status(404).send("The hobby with the given Id was not found")
    : res.status(200).send(hobbyEntity);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const hobbyEntity = new HobbyEntity(
    _.pick(req.body, [
      "name",
      "description",
      "sessions",
      "experienceInYears",
      "timeOfSessionInMinuts",
      "language",
      "status",
      "place",
      "priceInCent",
      "tools",
    ])
  );

  await hobbyEntity.save();

  return res.status(201).send(hobbyEntity); //I should redirect to get individual endpoint
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const hobbyEntity = await HobbyEntity.findByIdAndUpdate(
    req.params.id,
    _.pick(req.body, [
      "name",
      "description",
      "sessions",
      "experienceInYears",
      "timeOfSessionInMinuts",
      "language",
      "status",
      "place",
      "priceInCent",
      "tools",
    ]),
    { new: true }
  );

  if (!hobbyEntity)
    return res.status(404).send("The hobby with the given Id was not found");

  return res.status(201).send(hobbyEntity);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const hobbyEntity = await HobbyEntity.findByIdAndRemove(req.params.id);

  if (!hobbyEntity)
    return res.status(404).send("The hobby with the given Id was not found");

  return res.status(204).send(hobbyEntity);
});

module.exports = router;
