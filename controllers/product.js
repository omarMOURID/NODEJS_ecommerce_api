const ProductModel = require('../models/product');
const deleteFile = require('../utils/image_uploader').delteFile;


//controllers

// get all the products that we have in our database
const getAllProducts = async (req, res) => {
    const allProducs = await ProductModel.find().populate('categorie').exec();
    res.status(200).json(allProducs);
};

// create a new product and save it into our database
const createProduct = async (req, res) => {
    const {imageProduct1, imageProduct2, imageProduct3, imageProduct4} = req.files;
    try {
        const {name, desc, categorie, quantity, price} = req.body;
        // to get all our images from req.files using the middleware multer
        console.log(name, desc, categorie, quantity, price)
        const newProduct = new ProductModel();
        
        newProduct.name = name;
        newProduct.categorie = categorie;
        newProduct.quantity = quantity;
        newProduct.price = price;
        
        newProduct.image1 = imageProduct1[0].path;
        imageProduct2 && (newProduct.image2 = imageProduct2[0].path);
        imageProduct3 && (newProduct.image3 = imageProduct3[0].path);
        imageProduct4 && (newProduct.image4 = imageProduct4[0].path);
        desc && (newProduct.desc = desc);
        await newProduct.save();
        res.status(201).json(newProduct);

    } catch(error) {
        imageProduct1 && (await deleteFile(imageProduct1[0].path));
        imageProduct2 && (await deleteFile(imageProduct2[0].path));
        imageProduct3 && (await deleteFile(imageProduct3[0].path));
        imageProduct4 && (await deleteFile(imageProduct4[0].path));
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};


// get the product with id
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;  
        const product = await ProductModel.findById(id);
            
        if(product) {
            res.status(200).json(product);
        } else {
            throw new Error("no product with that id:"+id);
        }
    } catch(error) {
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};

// update the product with id
const updateProduct = async (req, res) => {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    const {imageProduct1, imageProduct2, imageProduct3, imageProduct4} = req.files;
    try {
        if(product) {
            const {name, desc, quantity, categorie, price} = req.body;
    
            // get all the old images
            const oldImage1 = product.image1;
            const oldImage2 = product.image2;
            const oldImage3 = product.image3;
            const oldImage4 = product.image4;
            
    
            // strore the path to the images into our database
            imageProduct1 && (product.image1 = imageProduct1[0].path)
            imageProduct2 && (product.image2 = imageProduct2[0].path)
            imageProduct3 && (product.image3 = imageProduct3[0].path)
            imageProduct4 && (product.image4 = imageProduct4[0].path)
    
            // update our product
            name && (product.name = name);
            desc && (product.desc = desc);
            quantity && (product.quantity = quantity);
            categorie && (product.categorie = categorie);
            price && (product.price = price);
    
            await product.save();

            // delete the old images for our server
            (oldImage1 && imageProduct1) && (await deleteFile(oldImage1));
            (oldImage2 && imageProduct2) && (await deleteFile(oldImage2));
            (oldImage3 && imageProduct3) && (await deleteFile(oldImage3));
            (oldImage4 && imageProduct4) && (await deleteFile(oldImage4));

            res.status(200).json(product);
        } else {
            throw new Error("no product with that id:"+id);
        }
    } catch(error) {
        imageProduct1 && (await deleteFile(imageProduct1[0].path));
        imageProduct2 && (await deleteFile(imageProduct2[0].path));
        imageProduct3 && (await deleteFile(imageProduct3[0].path));
        imageProduct4 && (await deleteFile(imageProduct4[0].path));
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};


// delete product
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    const product = await ProductModel.findById(id);
    try {
        if(product) {
            const image1 = product.image1;
            const image2 = product.image2;
            const image3 = product.image3;
            const image4 = product.image4;

            await product.deleteOne();

            image1 && (await deleteFile(image1));
            image2 && (await deleteFile(image2));
            image3 && (await deleteFile(image3));
            image4 && (await deleteFile(image4));

            res.status(203).json({message: "the product deleted with success"});
        } else {
            throw new Error("no product with that id:"+id);
        }   
    } catch(error) {
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};



module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
};