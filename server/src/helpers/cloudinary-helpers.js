const cloudinary = require("../configs/cloudinary");

const uploadImage = async (imagePath) => {
  const uploadResult = await cloudinary.uploader.upload(imagePath);
  return ({ public_id, secure_url } = uploadResult);
};

const destroyImage = async (publicId) => {
  const deleteResult = await cloudinary.uploader.destroy(publicId);
  return deleteResult;
};

module.exports = { uploadImage, destroyImage };
