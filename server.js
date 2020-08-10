const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const colors = require("colors");
const fileUpload = require("express-fileupload");
const errorHandler = require("./middleware/error.middleware");
const connectDB = require("./config/db.config");

// load config
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();
//route files
const auth = require("./routes/auth.routes");
const bootcamps = require("./routes/bootcamps.routes");
const reviews = require("./routes/reviews.routes");
const courses = require("./routes/courses.routes");
const users = require("./routes/admin/user.admin.routes");

const app = express();

//JSON Parser
app.use(express.json());
//mount middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(fileUpload({ createParentPath: true }));
app.use(cookieParser());

//mount router
app.use("/api/v1/auth", auth);
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/reviews", reviews);
app.use("/api/v1/admin/users", users);
app.use(errorHandler);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `App listening on port ${PORT}! in ${process.env.NODE_ENV} mode`.yellow.bold
  );
});

//handel unhandled promise reject
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`.red.underline.bold);
  //close server
  server.close(() => process.exit(1));
});
