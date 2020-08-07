const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const geoCoder = require("../utils/geoCoder");

const BootcampSchema = new mongoose.Schema(
  {
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
      validate: [
        (value) => validator.isURL(value, { protocols: ["http", "https"] }),
        (props) => `${props.value} is not valid url for website`,
      ],
    },
    phone: {
      type: String,
      validate: [
        (value) => validator.isMobilePhone(value),
        (props) => `${props.value} is not valid phone number`,
      ],
      maxLength: 20,
    },
    email: {
      type: String,
      validate: [
        (value) => validator.isEmail(value),
        (props) => `${props.value} is not valid email`,
      ],
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
        // required: true,
      },
      coordinates: {
        type: [Number],
        // required: true,
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
        "Web Development",
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
    averageCost: {
      type: Number,
    },
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//slugify name
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// covert address to coordinate
BootcampSchema.pre("save", async function (next) {
  const location = await geoCoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [location[0].longitude, location[0].latitude],
    formattedAddress: location[0].formattedAddress,
    street: location[0].streetName,
    city: location[0].city,
    state: location[0].stateCode,
    zipcode: location[0].zipcode,
    country: location[0].countryCode,
  };
  this.address = undefined;
  next();
});

// Cascade delete
BootcampSchema.pre("remove", async function (next) {
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with virtual
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);
