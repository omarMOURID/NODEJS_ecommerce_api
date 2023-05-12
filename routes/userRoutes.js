const express = require('express');
const controller = require('../controllers/user');
const imageUploader = require('../utils/image_uploader').uploadAvatar;
const authenticationMiddleware = require('../auth/validateToken');
const authorizationMiddleware = require('../auth/authorization');


const router = express.Router();


router.get('/', authenticationMiddleware, authorizationMiddleware, controller.getAllUsers);
router.get('/me', authenticationMiddleware, controller.getCurrentUser);
router.get('/:id', authenticationMiddleware, authorizationMiddleware, controller.getUserById);
router.post('/', imageUploader, controller.createUser);
router.put('/:id', imageUploader, controller.updateUser);
router.delete('/:id', authenticationMiddleware, authorizationMiddleware, controller.deleteUser);

module.exports = router;