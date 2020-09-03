const mongoose = require("mongoose");
//https://stackoverflow.com/questions/16641210/mongoose-populate-with-array-of-objects-containing-ref
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Product must have a name."],
    unique: true,
    trim: true
  },
  category: {
    //Parent referencing
    type: mongoose.Schema.ObjectId,
    ref: "Category",
    required: [true, "a Product must belong to a Category."]
  },
  image: String,
  description: {
    type: String,
    required: [true, "A Product must have a Description."]
  },
  features: {
    type: String,
    required: [true, "A Product must have Features."]
  },
  link: {
    type: String
  }
});

productSchema.index({
  name: "text",
  description: "text",
  features: "text",
  safetyFeatures: "text"
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

//https://stackoverflow.com/questions/14348516/cascade-style-delete-in-mongoose
