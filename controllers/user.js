const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const deleteFile = require('../utils/image_uploader').delteFile;



// give all the users that we have in our db
const getAllUsers = async (req, res) => {
    try { 
        const allUsers = await UserModel.find({}, "-hashPassword");
        res.status(200).json(allUsers);
    } catch ( error ) {
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};

const getCurrentUser = async (req, res) => {
    res.status(200).json(req.user);
}

// get user by id
const getUserById = async (req, res) => {
    try {
        const id = req.params.id;  
        const user = await UserModel.findById(id, "-hashPassword");
            
        if(user) {
            res.status(200).json(user);
        } else {
            throw new Error("no user with that id:"+id);
        }
    } catch(error) {
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};

// create a user
const createUser = async (req, res) => {
    const {email, firstname, lastname, password, phonenumber, address} = req.body
    const avatar = req.file;
    try {
        let user = new UserModel();
        const hashPassword = await bcrypt.hash(password, process.env.BCRYPT_SALT);

        user.email = email;
        user.firstname = firstname;
        user.lastname = lastname;
        user.address = address;
        user.hashPassword = hashPassword;
        phonenumber && (user.phonenumber = phonenumber);
        avatar && (user.avatar = avatar.path);

        await user.save();
        user = user.toJSON();
        delete user.hashPassword;

        res.status(201).json(user);
    } catch ( error ) {
        avatar && (await deleteFile(avatar.path));
        res.status(403).json(error.message ? {message: error.message} : error);
    }
    
};

// update the user
const updateUser = async (req, res) => {
    const id = req.params.id;
    const avatar = req.file;
    try {
        const user = await UserModel.findById(id);
        if(user) {
            const {firstname, lastname, phonenumber, address, block, role} = req.body;
    
            // get all the old images
            const oldAvatar = user.avatar;
            
            // update our product
            firstname && (user.firstname = firstname);
            lastname && (user.lastname = lastname);
            phonenumber && (user.phonenumber = phonenumber);
            address && (user.address = address);
            (block != null) && (user.block = block);
            role && (user.role = role);

            // strore the path to the images into our database
            avatar && (user.avatar = avatar.path)
    
            await user.save();

            // delete the old images for our server
            (oldAvatar && avatar) && (await deleteFile(oldAvatar));

            res.status(200).json(user);
        } else {
            throw new Error("no product with that id:"+id);
        }
    } catch(error) {
        avatar && (await deleteFile(avatar.path));
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};

//delete the user
const deleteUser = async(req, res) => {
    try {  
        const id = req.params.id;
        const user = await UserModel.findById(id);
        if(user) {
            const avatar = user.avatar;

            await user.deleteOne();

            avatar && (await deleteFile(avatar));

            res.status(203).json({message: `the user with id ${id} deleted with success`});
        } else {
            throw new Error("no user with that id:"+id);
        }   
    } catch(error) {
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};

// banne the user throw the block attribute 
const banneUser = async(req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findById(id);
        if(user) {
            user.block = true;

            await user.save();

            res.status(203).json({message: `the user with id ${id} banned with success`});
        } else {
            throw new Error("no user with that id:"+id);
        }   
    } catch(error) {
        res.status(403).json(error.message ? {message: error.message} : error);
    }
};

module.exports = {
    getAllUsers,
    getCurrentUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    banneUser,
};