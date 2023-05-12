const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

//define storage location for product files and by what name file should be saved
const multerStorageProduct = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.env.STATIC_FILES}/images/product`);
    },
    filename: (req, file, cb) => {
        cb(null, `image-product-${Date.now()}${path.extname(file.originalname)}`);
    }
});

//define storage location for avatar files and by what name file should be saved
const multerStorageAvatar = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${process.env.STATIC_FILES}/images/avatar`);
    },
    filename: (req, file, cb) => {
        cb(null, `image-avatar-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
        return cb(new Error('Please upload an image (png or jpg).'));
    } else {
        cb(null, true)
    }
};

const deleteFile = async (filePath) => {
    await fs.unlink(filePath);
};



module.exports.uploadProduct = multer({
    storage: multerStorageProduct,
    fileFilter: multerFilter
}).fields([
    {name: "imageProduct1"},
    {name: "imageProduct2"},
    {name: "imageProduct3"},
    {name: "imageProduct4"},
]);

module.exports.uploadAvatar = multer({
    storage: multerStorageAvatar,
    fileFilter: multerFilter
}).single('avatar');

module.exports.delteFile = deleteFile;

