const mongoose = require('mongoose');

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const validateZipCode = function(zipcode) {
    const re = /^[0-9]{5}(?:-[0-9]{4})?$/;
    return re.test(zipcode)
};

const validatePhoneNumber = function(phonenumber) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phonenumber);
};

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: "an account with this email already exist",
        validate: [validateEmail, 'Please fill a valid email address'],
        required: "email address is required"
    },
    hashPassword: {
        type: String,
        required: "password is required"
    },
    firstname: {
        type: String,
        required: "firstname is required"
    },
    lastname: {
        type: String,
        required: "lastname is required"
    },
    avatar: {
        type: String
    },
    phonenumber: {
        type: String,
        validate: [validatePhoneNumber, 'Please fill a valid phone number']
    },
    address: {
        type: String
    },
    role: {
        type: String,
        enum: [
            'admin',
            'user'
        ],
        default: 'user',
        required: true
    },
    block: {
        type: Boolean,
        default: false,
        required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('User', UserSchema);