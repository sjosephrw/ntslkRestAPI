const Product = require("../models/product");

//controllers
const factory = require("./handlerFactory");

//https://stackoverflow.com/questions/12821596/multiple-populates-mongoosejs
//https://stackoverflow.com/a/32473842

//https://stackoverflow.com/questions/21069813/mongoose-multiple-query-populate-in-a-single-call/45940863
//https://stackoverflow.com/a/21100156
exports.getAllProducts = factory.getAll(Product, [
  { path: "menu", select: "_id name" }
]);

exports.createProduct = factory.createOne(Product);

exports.getProduct = factory.getOne(Product, [
  { path: "menu", select: "_id name" }
]);

exports.updateProduct = factory.updateOne(Product);

exports.deleteProduct = factory.deleteOne(Product);
