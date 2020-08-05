const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");

const errorHandler = require("./middleware/error.middleware");
const connectDB = require("./config/db.config");

// load config
dotenv.config({ path: "./config/config.env" });

// Connect to DB
connectDB();
//route files
const bootcamps = require("./routes/bootcamps.routes");

const app = express();

//JSON Parser
app.use(express.json());
//mount middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount router
app.use("/api/v1/bootcamps", bootcamps);
app.use(errorHandler);

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
