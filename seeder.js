const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const Bootcamp = require("./models/Bootcamp.schema");
const Course = require("./models/Course.schema");

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const Courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);

const importData = async () => {
  try {
    console.log("loading ...".yellow.inverse);
    await Bootcamp.create(bootcamps);
    await Course.create(Courses);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

const deleteData = async () => {
  try {
    console.log("loading ...".yellow.inverse);
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("DATA DELETED ...".green.inverse);
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
