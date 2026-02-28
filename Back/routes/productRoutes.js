/**
 * Rutas de produtos
 * define los endpoints CRUD para la gestion de productos
 * los productos son elementos dentro de las subcategorias
 * endpoints:
 * Post /api/products crea una nueva productos
 * Get /api/products obtiene todas las produtos
 * Get /api/products/:id obtiene una productos por id
 * Put /api/products/:id actualiza una productos por id
 * Delete /api/products/:id elimina una productos/desactivae
 */

const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController");
const { check } = require("express-validator");
const { verifyToken } = require("../middleswares/authJWT");
const { checkRole } = require("../middleswares/role");

const validateproducts = [
  (check = "name".not().isEmpty().whitmessage("el nombre es obligatorio")),

  (check = "description"
    .not()
    .isEmpty()
    .whitmessage("la descripcion es obligatoria")),

  (check = "precio"
    .not()
    .isEmpty()
    .whitmessage("la descripcion es obligatoria")),

  (check = "stock"
    .not()
    .isEmpty()
    .whitmessage("la descripcion es obligatoria")),
  
    (check = "category"
    .not()
    .isEmpty()
    .whitmessage("la descripcion es obligatoria")),

  (check = "subcategory"
    .not()
    .isEmpty()
    .whitmessage("la subcategoria es obligatoria")),
];

// Rutas CRUD

router.post(
  "/",
  verifyToken,
  checkRole(["admin", "coordinador", 'auxiliar']),
  validateproducts,
  productsController.products,
);

router.get("/", productsController.getProducts);

router.get("/:id", productsController.getproductsById);

router.put(
  "/:id",
  verifyToken,
  checkRole(["admin", "coordinador"]),
  productsController.updateProducts,
);

router.delete(
  "/:id",
  verifyToken,
  checkRole("admin"),
  productsController.deleteProducts,
);

module.exports = router;
