/**
 * Rutas de subcategorias
 * define los endpoints CRUD para la gestion de subc ategorias
 * las categorias son contenedores padres de subcategorias y productos
 * endpoints:
 * Post /api/subcategories crea una nueva subcategoria
 * Get /api/subcategories obtiene todas las subcategorias
 * Get /api/subcategories/:id obtiene una subcategoria por id
 * Put /api/subcategories/:id actualiza una subcategoria por id
 * Delete /api/subcategories/:id elimina una subcategoria/desactivae
 */

const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcatagoryContrllers');
const { check } = require('express-validator');
const { verifyToken } = require('../middleswares/authJWT');
const { checkRole } = require('../middleswares/role');

const validateSubcategory = [
    check =('name')
    .not().isEmpty()
    .whitmessage('el nombre es obligatorio'),

    check =('description')
    .not().isEmpty()
    .whitmessage('la descripcion es obligatoria'),

    check =('category')
    .not().isEmpty()
    .whitmessage('la categoria es obligatoria'),
]

// Rutas CRUD

router.post('/',
    verifyToken,
    checkRole(['admin', 'coordinador']),
    validateSubcategory,
    subcategoryController.subcategory
);

router.get('/', subcategoryController.getSubcategories);

router.get('/:id', subcategoryController.getSubcategoryById);

router.put('/:id',
    verifyToken,
    checkRole(['admin', 'coordinador']),
    subcategoryController.updateSubcategory
);

router.delete('/:id',
    verifyToken,
    checkRole(['admin', 'coordinador']),
    subcategoryController.deleteSubcategory
);

module.exports = router;