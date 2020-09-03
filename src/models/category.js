const mongoose = require("mongoose");

const Product = require("./product");

//https://stackoverflow.com/questions/16641210/mongoose-populate-with-array-of-objects-containing-ref
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A categories must have a name."],
      unique: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true } }
); //https://mongoosejs.com/docs/populate.html#populate-virtuals

categorySchema.pre("remove", function(next) {
  // 'this' is the client being removed. Provide callbacks here if you want
  // to be notified of the calls' result.
  // Category.remove({categories: this._id}).exec();
  Product.remove({ category: this._id }).exec();
  next();
});

//VIRTUAL PROPERTIES , reviews is the name of the virtual property
//to get the reviews for a tour we could write a query to do it manually, but we are creating
//a child ref. as a virtual property that will store the reviews data in a virtual array that
//wont be persisted in the DB, but will only show in the output.
//https://mongoosejs.com/docs/populate.html#populate-virtuals
categorySchema.virtual("products", {
  ref: "Product", //the child reference.
  foreignField: "category", //the tour field in the reviews collection (The 2 fields to join)
  localField: "_id", //the _id field in the Tour Collection (The 2 fields to join)
  // If `justOne` is true, 'products' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false
});

// categoriesSchema.post('remove', function(doc) {
//     Category.remove({ categories: doc._id }).exec();
//     Product.remove({ categories: doc._id }).exec();
// });

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
