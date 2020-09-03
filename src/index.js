const express = require("express");

const dotenv = require('dotenv');

dotenv.config({path: './src/config.env'});//*************IMPORTANT - THE CONFIG FILE MUST BE IMPORTED BEFORE const app = require('./app');*/

console.log(process.env.DB);

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');

const { ErrorHandler, handleError } = require("./utils/error");

const category = require("./routes/category");
const product = require("./routes/product");
const project = require("./routes/project");
const user = require("./routes/user");
const auth = require("./routes/auth");
const email = require("./routes/email");


//https://expressjs.com/en/guide/behind-proxies.html
//When running an Express app behind a proxy, set (by using app.set()) the application variable trust proxy to one of the values listed in the following table. - refer to the link above
app.set('trust proxy', true);
 
 
//forces hsts as well -> refer to documentatio on github. 
app.use(helmet()); 
  
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many accounts created from this IP, please try again after an hour"
});
 
//  apply to all requests
app.use(limiter);

app.use(cors());

app.use(express.json({ limit: "10kb" }));
//to parse form body data
app.use(express.urlencoded({ extended: true, limit: "10kb" })); //extended to parse more complicated data

//And prevent NoSQL injection, it removes data with NOSQL INJECTIONS:
app.use(mongoSanitize());

app.get("/backend", (req, res) => {
  res.json({
    status: "success",
    msg: "Welcome to the API",
    version: "V1",
    app: "NEO TECH SOLUTIONS"
  });
});

app.use("/backend/api/v1/category", category);
app.use("/backend/api/v1/product", product);
app.use("/backend/api/v1/project", project);
app.use("/backend/api/v1/user", user);
app.use("/backend/api/v1/auth", auth);
app.use("/backend/api/v1/email", email);

//.all  = all http methods, * = all undefined routes
app.all("*", (req, res, next) => {
  next(
    new ErrorHandler(
      404,
      `Sorry the URL - ${req.originalUrl} - was not found on our server. 🌛`
    )
  );
});

//express global error handling MW
app.use((err, req, res, next) => {
  //console.log(err);
  handleError(err, res);
});

const DATABASE = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connection successful!"));

const port = process.env.PORT || 3000;

//console.log(process.env.NODE_ENV);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
