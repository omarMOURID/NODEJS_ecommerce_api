const CategoriModel = require('../models/categorie');
const ProductModel = require('../models/product');

const getAllCategories = async (req, res) => {
    const allCatgories = await CategoriModel.find().sort("name");
    res.status(200).json(allCatgories);
};

const getCategorieById = async (req, res) => {
    const id = req.params.id;
    const categorie = await CategoriModel.findById(id);
    if(categorie) {
        res.status(200).json(categorie);
    } else {
        res.status(403).send("no categorie with that id:"+id);
    } 
};

const createCategorie = async (req, res) => {
    const {name, desc} = req.body;
    if(name) {
        const categorie = new CategoriModel({name, desc});
        await categorie.save();
        res.status(201).json(categorie);
    } else {
        res.status(403).send('some fields are required');
    }
};

const updateCategorie = async (req, res) => {
    const id = req.params.id;
    const categorie = await CategoriModel.findById(id);
    if(categorie) {
        const {name, desc} = req.body;
        categorie.name = name;
        categorie.desc = desc;
        await categorie.save();
        res.status(201).json(categorie);
    } else {
        res.status(403).send("no categorie with that id:"+id);
    } 
};

const deleteCategorie = async (req, res) => {
    const id = req.params.id;
    try {
        const categorie = await CategoriModel.findById(id);
        if(categorie) {
            const products = await ProductModel.findOne({categorie: categorie._id});
            if(products) {
                throw new Error("Some product related to this category please first update those products");
            }
            await categorie.deleteOne();
            res.status(200).send("Category deleted with success");
        } else {
            throw new Error("No category with that id:"+id);
        } 
    } catch(error) {
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};




module.exports = {
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    deleteCategorie,
};