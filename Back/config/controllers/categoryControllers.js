/**
 * Controlador de categorias.
 * mmaneja todas las operaciones (CRUD) relacionadas con categorias.
 *
 */

const Category = require("../models/Category");

/**
 * create: Crear una nueva categoria.
 * POST/ api/categories
 * Auth bearer token requerido.
 * body requerido.
 * name nombre de la categoria.
 * descriotion: desdripcion de la categoria.
 * retorna:
 * 201: categoria creada en mongoDB.
 * 400: validacion fallida o nombre duplicado.
 * 500: error en la base de datos.
 */

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    //Validacion de los campos de entrada
    if (!name || typeof name !== "string" || name.trim()) {
      return res.status(400).json({
        success: false,
        message:
          " El nombre de la categoria es obligatorio y debe ser un texto valido.",
      });
    }

    if (
      !description ||
      typeof description !== "string" ||
      !description.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          " La descripcion de la categoria es obligatoria y debe ser un texto valido.",
      });
    }

    //Limpiar espácios en blanco
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    //Verificar so ya existe una categoria con el mismo nombre
    const existingCategory = await Category.findOne({ name: trimmedName });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una categoria con ese nombre.",
      });
    }

    //Creas una categoria nueva
    const newCategory = new Category({
      name: trimmedName,
      description: trimmedDesc,
    });

    await newCategory.save();

    return res.status(201).json({
      success: true,
      message: "Ctegoria creada exitosamente.",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error en createCategory:", error);
    //Maneo de error de indice unico
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una categoria con ese nombre.",
      });
    }
    //Erro generico del servidor
    res.status(500).json({
      success: false,
      message: "Error al crear la categoria.",
      error: error.message,
    });
  }
};

/**
 * GET consultar listado de categorias.
 * GET /api/catedories
 * por defecto retorna solo las categorias activas.
 * con includeInactive=true retorna todas las categorias.
 * retorna:
 * 200: lista de categorias.
 * 500: error de base de datos.
 */

exports.getCategories = async (req, res) => {
    //por defecto spñp las categorias activas
    //IncludeInactive=true retorna todas las categorias
    const includeInactive = req.query.includeInactive === 'true';
    const activeFilter = includeInactive ? {} : { active: { $ne: false } };

    const categories = await Category.find(activeFilter).sort({ createDat: -1});
    res.status(200).json({
        success: true,
        data: categories
    });

}