// @desc get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).send({ message: 'get all' });
};

// @desc get single bootcamps
// @route GET /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).send({ message: 'get one', id: req.params.id });
};

// @desc create new bootcamps
// @route POST /api/v1/bootcamps
// @access Private

exports.createBootcamp = (req, res, next) => {
  res.status(200).send({ message: 'post' });
};

// @desc update bootcamps
// @route PUT /api/v1/bootcamps/:id
// @access Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).send({ message: 'put', id: req.params.id });
};

// @desc delete bootcamps
// @route DELETE /api/v1/bootcamps/:id
// @access Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).send({ message: 'delete' });
};
