const mongoose = require("mongoose");

const toolEntitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 255,
  },
  notes: {
    type: String,
    minlength: 30,
    maxlength: 3000,
  },
});

exports.toolSchema = toolEntitySchema;
