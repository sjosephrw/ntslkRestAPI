const Project = require("../models/project");

//controllers
const factory = require("./handlerFactory");

//https://stackoverflow.com/questions/12821596/multiple-populates-mongoosejs
//https://stackoverflow.com/a/32473842

//https://stackoverflow.com/questions/21069813/mongoose-multiple-query-populate-in-a-single-call/45940863
//https://stackoverflow.com/a/21100156
exports.getAllProjects = factory.getAll(Project);

exports.createProject = factory.createOne(Project);

exports.getProject = factory.getOne(Project);

exports.updateProject = factory.updateOne(Project);

exports.deleteProject = factory.deleteOne(Project);
