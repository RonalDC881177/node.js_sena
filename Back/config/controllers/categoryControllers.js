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
    const updateData = {};

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

  const categories = await Category.find(activeFilter).sort({ createDat: -1 });
  res.status(200).json({
    success: true,
    data: categories
  });

} catch (error) {
  console.error("Error en getCategories:", error);
  res.status(500).json({
    success: false,
    message: "Error al obtener las categorias.",
    error: error.message
  });
} 

}

/**
 * UPDATE Catualizer una categoria.
 * PUT /api/categories/:id
 * Auth Bearer token requerido.
 * roles admin y coodinador
 * body
 * name: nuevo nombre de la categoria.
 * description: nueva descripcion
 * validaciones
 * Si quiere solo actualiza el nombre solo la descripcion o los dos.
 * Retorna:
 * 200: Categoria actualizada
 * 400: Nombre duplicado
 * 404: Categoria no encontrada
 * 500: Error de base de datos.
 */

exports.uodateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const UpdateData = {};

    if (name) {
      if (typeof name !== 'string' name.trim()) {
        return res.status(400).json({
          success: false,
          message: "El nombre de la categoria debe ser un texto valido."
        });
      }
      UpdateData.name = name.trim();

    }
    if (description) {
      if (typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({
          success: false,
          message: "La descripcion de la categoria debe ser un texto valido."
        });
      }
      UpdateData.description = description.trim();
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      UpdateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria no encontrada."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Categoria actualizada exitosamente.",
      data: category
    });
  } catch (error) {
    console.error("Error en updateCategory:", error);
    //Manejo de error de indice unico
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una categoria con ese nombre."
      });
    }
    //Error generico del servidor
    res.status(500).json({
      success: false,
      message: "Error al actualizar la categoria.",
      error: error.message
    });
    if (description) {
      UpdateData.description = description.trim();
    }

    //Actualizar la categoeria en la base de datos
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      UpdateData,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Categoria no encontrada."
      });
    }
    res.status(200).jsom({
      success: true,
      message: "Categoria actualizada exitosamente.",
      data: updatedCategory
    });
  } catch (error) {
    console.error('Error en updateCategory', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la categoria.',
      error: error.message
    });
  }
};

/**
 * Delete eliminar o desactivar una categoria.
 * DELETE /api/categories/:id
 * Auth Bearer token es requerido.
 * roles; admin
 * query param:
 * hardDelelte=true elimina permanentemente de la base
 * default: soft delete (solo desactivar)
 * SOFT DELETE: marca la categoria como inactiva
 * Desactiva en cascada todas las subcategorias y productos relacionados.
 * Al activar retorna todos los datos incluyendo los inactivos.
 * HARD DELETE: elimina permanentemente la categoria de la base de datos.
 * Elimina en cascada la categoria, subcategoria y productos relacionados.
 * NO se puede recuperar
 * retorna:
 * 200: Categoria eliminada o desactivada
 * 404: Categoria no encontrada
 * 500: Error de base de datos
 */

exports.deleteCategory = async (req, res) => {
  try {
    const SubCategory = require('../models/SubCategory');
    const Product = require('../models/Product');
    const isHardDelete = req.query.hardDelete === 'true';

    //Buscar categoria a eliminar
    const category = await Category.findById(req.paramas.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Categoria no encontrada."
      });
    }
    if (isHardDelete) {
      //Elimina en cascada subcategorias y productos relacionados
      //paso 1 para obtene IDs de todas las subcategorias relacionadas
      const subIds = (await SubCategory.find({ category: req.params.id })).map(s => s.id);
      //Paso 2 eliminar todos los productos
      await Product.deleteMany({ category: req.params.id });
      //Paso 3 eliminar todo de subcategoria
      await Product.deleteMany({ SubCategory: { $in: subIds } });
      //paso 4 eliminar todas las subcategorias de esta categoria
      await SubCategory.deleteMany({ category: req.params.id });
      //paso 5 eliminar la categoria misma
      await Category.findByAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Catedoria eliminada permanentemente y sus subcategorias y productos relacionados',
        data: {
          category: category
        }
      });

    }
    else
      //soft delete solo marcar como inactivo con cascada
      category.active = false;
    await category.save();

    //Desactivar todas las subcategorias relacionadas
    const subcategories = await SubCategory.updateMany(
      { category: req.params.id },
      { active: false }
    );

    //Desactivar todos los productos relacionados a esta categoria
    const products = await Product.updateMany(
      { category: req.params.id },
      { active: false }
    );
    res.status(200).json({
      success: true,
      message: 'Catregoria desactivada exitisamente y sus subcategorias y productos.',
      data: {
        category: category,
        subcategoriesDeactivated: subcategories.modifiedCount,
        productsDesactivated: products.modifiedCount
      }
    });
  } catch (error) {
    console.error('Error en deleteCategory:', error);
    res.status(500).json({
      success: false,
      message: 'Error al desactivar la categoria.',
      error: error.message
    });
  }
}
