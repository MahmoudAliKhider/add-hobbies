const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const orderEntitySchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: new Date(),
  },
  coachId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  learnerId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  hobbyId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

function validateAgainstErrors(orderEntity) {
  const scheme = {
    hobbyId: Joi.objectId().required(),
    coachId: Joi.objectId().required(),
    learnerId: Joi.objectId().required(),
  };

  return Joi.validate(orderEntity, scheme);
}

exports.OrderEntity = mongoose.model("Order", orderEntitySchema);
exports.validate = validateAgainstErrors;
