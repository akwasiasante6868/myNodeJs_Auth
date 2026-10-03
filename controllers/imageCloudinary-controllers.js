const Image = require("../Models/image");
const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const fs = require("fs");
const cloudinary = require("../config/cloudinary")

const uploadImage = async (req, res) => {
  try {
    // check if file is missing
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "This file is not found. Please upload an image",
      });
    }

    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store the image url and publicId along with the uploader userId to your database
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userID,
    });

    await newlyUploadedImage.save();

    res.status(201).json({
      success: true,
      message: "Image is uploaded successfully",
      image: newlyUploadedImage,
    });

  } catch (error) {
    console.log(error);

    // delete local file on failure if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Image upload failed. Please try again",
    });
  }
};

const fetchImageController = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit

    const sortBy = req.query.sortBy || "createdAt"
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
    const totalImages = await Image.countDocuments()
    const totalPages = Math.ceil(totalImages/ limit)

    const sortObj = {}
    sortObj[sortBy] = sortOrder
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);



    if (images) {
      res.status(200).json({
        success: true,
        currentPage : page,
        totalPages : totalPages,
        totalImages : totalImages,
        data: images,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const deleteImageController = async(req, res) => {
  try {
    // get the image you want to delete by id 
    const getCurrentIdOfImageToBeDeleted = req.params.id;
    const userId = req.userInfo.userID

    // we find the current image of the image to be deleted

    const image = await Image.findById(getCurrentIdOfImageToBeDeleted)

    if(!image){
      return res.status(404).json({
        success : false,
        message : "Image not found"
      })
    }

    //check if this image is uploaded by the current user who is trying to delete this image

    if(image.uploadedBy.toString() !== userId){
      return res.status(403).json({
        success : false,
        message : 'You are not authorized to delete this image'
      })
    }

  // 1. Delete image from cloudinary
  await cloudinary.uploader.destroy(image.publicId)

  // 2. Delete image from mongoDb database

  await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted)

  res.status(200).json({
    success : true,
    message : 'Image is successfully deleted'
  })


    
  } catch (error) {
  console.log(error)
  return res.status(500).json({
    success : false,
    message: 'Something went wrong. Please try again!'
  })    
  }
}

module.exports = { uploadImage, fetchImageController, deleteImageController };
