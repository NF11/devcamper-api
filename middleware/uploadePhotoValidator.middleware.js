const path = require("path");
const ErrorResponse = require("../utils/errorResponse");

//@desc Setup and validation on uploaded photo
const uploadPhotoValidator = (model) => async (req, res, next) => {
  const result = await model.findById(req.params.id);
  // validation
  if (!result)
    return next(new ErrorResponse(`not found with id ${req.params.id}`, 404));

  if (!req.files) return next(new ErrorResponse(`not file found`, 400));

  const uploadedFile = req.files.file;

  if (!uploadedFile.mimetype.startsWith("image"))
    return next(new ErrorResponse(`not image type`, 400));

  if (!uploadedFile.size < process.env.MAX_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        `please upload an image less then ${process.env.MAX_UPLOAD_SIZE}`,
        400
      )
    );
  }
  // create custom file name
  uploadedFile.name = `photo_${result._id}${path.parse(uploadedFile.name).ext}`;
  await uploadedFile.mv(
    `${process.env.FILE_UPLOAD_PATH}/${uploadedFile.name}`,
    async (e) => {
      if (e) {
        console.log(e);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
      res.uploadPhotoName = uploadedFile.name;
    }
  );
  next();
};

module.exports = uploadPhotoValidator;
