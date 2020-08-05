const mongoose = require("mongoose");
const validator = require("validator");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add message"],
    unique: true,
    trim: true,
    maxLength: 50,
  },
  slug: String,
  description: {
    type: String,
    required: true,
    maxLength: 500,
  },
  website: {
    type: String,
    validate: {
      validate: (value) =>
        validator.isURL(value, { protocols: ["http", "https"] }),
      message: (props) => `${props.value} is not valid url for website`,
    },
  },
  phone: {
    type: String,
    maxLength: 20,
  },
  email: {
    type: String,
    validate: {
      validate: (value) => validator.isEmail(value),
      message: (props) => `${props.value} is not valid email`,
    },
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    //GeoJSON point
    type: {
      type: String,
      enum: ["point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    required: true,
    enum: [
      "web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.Model("Bootcamp", BootcampSchema);
