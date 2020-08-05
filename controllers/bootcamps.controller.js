const Bootcamp = require("../models/Bootcamp.schema");

// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = async (req, res, next) => {
  try {
    const result = await Bootcamp.find();
    res.status(200).send({ success: true, count: result.length, data: result });
  } catch (e) {
    res.status(400).send({ success: false, messages: e.message });
  }
};

// @desc get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const result = await Bootcamp.findById(req.params.id);
    if (!result) return res.status(400).send({ success: false, messages: 0 });
    res.status(200).send({ success: true, data: result });
  } catch (e) {
    res.status(400).send({ success: false, messages: e.message });
  }
};

// @desc create new bootcamps
// @route POST /api/v1/bootcamps
// @access Private

exports.createBootcamp = async (req, res, next) => {
  try {
    const result = await Bootcamp.create(req.body);
    res.status(201).send({ success: true, data: result });
  } catch (e) {
    res.status(400).send({ success: false, messages: e.message });
  }
};

// @desc update bootcamps
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = async (req, res, next) => {
  try {
    const result = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) return res.status(400).send({ success: false, messages: 0 });
    res.status(200).send({ success: true, data: result });
  } catch (e) {
    res.status(400).send({ success: false, messages: e.message });
  }
};

// @desc delete bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const result = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!result) return res.status(400).send({ success: false, messages: 0 });
    res.status(200).send({ success: true, data: result });
  } catch (e) {
    res.status(400).send({ success: false, messages: e.message });
  }
};
