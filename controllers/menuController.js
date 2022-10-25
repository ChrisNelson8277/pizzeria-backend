const asyncHandler = require("express-async-handler");
const menuItems = require("../model/menuSchema");

const getMenu = asyncHandler(async (req, res) => {
  const menu = await menuItems.find();
  res.status(200).json(menu);
});
const setMenu = asyncHandler(async (req, res) => {
  const menu = await getMenu.find();
  res.status(200).json({});
});

module.exports = {
  getMenu,
};
