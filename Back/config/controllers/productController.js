/***
 * Body: {name, description, price, stock, subcategory}
 * Auth: Bearer token requerido.
 * Roles: admin y coordinador
 * 
 * 201: producto creado en MongoDB
 * 400: Validacion fallida o nombre duplicado.th
 * 404: categoria padre no existe.
 * 500: Error en base de datos.
 */
exports.createProducto = async (req, res) => {
    try {const { name, description, price, stock, category, subcategory } = req.body;

    // Validaciones.
    // Verificar que todos los campos requeridos esten presentes.
    if (!name || !description || !price || !stock || !category || !subcategory) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios.',
            requiredFields: ['name', 'description', 'price', 'stock', 'category', 'subcategory']
        });
    }

    // Validar que la categoria existe.
    const categoryExists = await category.findById(category);
    if (!categoryExists) {
        return res.status(404).json({
            success: false,
            message: 'La categoria solicitada no existe.'
            categoryId: category
        });
    }
    
    // Validar que la subcategoria existe y pertenece a la categoria especificada.
    const subcategoryExists = await subcategory.findOne({
        _id: subcategory,
        category: category
    });
    if (!subcategoryExists) {
        return res.status(400).json({
            success: false,
            message: 'La subcategoria no existe o no pertence a la categoria especificada.'
        });
    
    }

    //===CREAR PRODUCTO===
    const product = new Product({
        name,
        description,
        price,
        stock,
        category,
        subcategory
    });

    //Si hay usuario autenticado, registrar quien creo el producto.
    if (req.user && req.user._id) {
        product.createdBy =req.user._id;
    }

    // Guardar en la base de datos.
    const savedProduct = await product.save();

    // Obtener producto poblado con datos de relaciones (populate).

}