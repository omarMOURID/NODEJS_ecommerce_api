const express = require('express');
const controller = require('../controllers/product');
const imageUploader = require('../utils/image_uploader').uploadProduct;
const authenticationMiddleware = require('../auth/validateToken');
const authorizationMiddleware = require('../auth/authorization');


const router = express.Router();

router.get('/', controller.getAllProducts);
router.post('/', authenticationMiddleware, authorizationMiddleware, imageUploader, controller.createProduct);
router.get('/:id', controller.getProductById);
router.put('/:id', authenticationMiddleware, authorizationMiddleware, imageUploader, controller.updateProduct);
router.delete('/:id', authenticationMiddleware, authorizationMiddleware, controller.deleteProduct);

module.exports = router;