const Category = require("../models/category");

//controllers
const factory = require("./handlerFactory");

//I AM NOT POPULATING THE PRODUCTS ARRAY WITH ALL THE PRODUCT DETAILS WHEN CALLING GET ALL CATEGORIES, BUT ONLY THE PRODUCT IDS WILL BE THERE
exports.getAllCategories = factory.getAll(Category);

exports.createCategory = factory.createOne(Category);

//https://mongoosejs.com/docs/populate.html#field-selection
exports.getCategory = factory.getOne(Category, {
  path: "products",
  select: "_id name image"
});

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
