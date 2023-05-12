const express = require('express');
const controller = require('../controllers/categorie');

const router = express.Router();

router.get('/', controller.getAllCategories);
router.get('/:id', controller.getCategorieById);
router.post('/', controller.createCategorie);
router.put('/:id', controller.updateCategorie);
router.delete('/:id', controller.deleteCategorie);

module.exports = router;