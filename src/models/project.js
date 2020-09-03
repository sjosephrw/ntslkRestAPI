const mongoose = require("mongoose");
//https://stackoverflow.com/questions/16641210/mongoose-populate-with-array-of-objects-containing-ref
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A Project must have a name."],
    unique: true,
    trim: true
  },
  image: String,
  description: {
    type: String,
    required: [true, "A Product must have a Description."]
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
