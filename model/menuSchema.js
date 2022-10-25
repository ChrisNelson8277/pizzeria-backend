const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  Name: {
    type: String,
    required: true,
  },
  smallPrice: {
    type: Number,
    required: true,
  },
  mediumPrice: {
    type: Number,
    required: true,
  },
  largePrice: {
    type: Number,
    required: true,
  },
  toppings: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("menuitem", menuSchema);
