/**
 * Modelo de producto  MongoDB
 * Define la estructura de los productos
 * el producto depende de una subcategoria que depende de una categoria.
 * Muchaos productos pudebn pertenecer a una subcategoria.
 * Tiene relación un user para ver quien creo el producto.
 * Soporte de imagenes (array de url)
 * validacion de valores numericos (no negativos)
 */

const mongoose = require('mongoose');

//Campos de la tabla productos  

const productSchema = new mongoose.Schema({
    //nombre del producto unico y requerido
    name: {
        type: String,
        required: [true,'El nombre es obligatorio'],
        unique: true,//No pueden haber dos productos con el mismo nombre
        trim: true,//Eliminar espacios al inicio y al final}
    
    },

    //Descripcion del producto opcional
    
    description: {
        type: String,
        required: [true,'La descripcion es obligatoria'],
        trim: true,
    },

    // precio en unidades monetarias
    //No puede ser negativo
    price: {
        type: String,
        required: [true,'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo'],
    },

    // Cantidad de stock 
    //No puede ser negativo
    stock: {
        type: Number,
        required: [true,'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
    },


    //Categoria padre esta subcategoria perteneca a una categoria
    // relacion 1 - muchos Una categoria puede tener muchas subcategorias
    // un producto pertece a una categoria pero una subcategoria puede tener miuchos productos relacion 1 - muchos

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Puede ser poblado con -populate ('category')
        required:[true, 'La categoria es requerida']
    },

    //Subcategoria padre esta subcategoria perteneca a una subcategoria

    subcategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory', // Puede ser poblado con -populate ('subcategory')
        required:[true, 'La subcategoria es requerida']
    },

    // quien creo el producto
    //Referencia de User no requerido.

    createdby:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'//ouede ser poblado para mostrar los usuarios
    },

    //Array de urls de imagenes de productos
    images: [{
        type: String, //url de la imagen
    }],

    //Active desactiva el producto pero no la elimina.
    active: {
        type: Boolean,
        default: true, // por defecto el producto esta activo
    },
},{
    timestamps: true, // agrega createDat y updateAt
    versionKey: false, // elimina el campo __v
});

 /**
  * MIDLEWARES PRE-SAVE
  * LIMPIA INDICES DUPLICADOS
  * MONGODB a veces crea multiples indices con el mismo nombre
  * este middleware limpia los indoces problematicos
  * proceso
  * 1 optiene una lista de todos los indices de la coleccion
  * 2 busca si existe indice con el nombre 'name_1' (indice unico en el campo name)
  * si existe lo elimina  antes de nuevas operaciones
  * ignora errores si el indice no existe o si ocurre un error al eliminarlo
  * continua con el guardado normal del documento
  */
 productSchema.post('save', function (error, doc, next) {
 
    //verificar si es error de mongoDB por violacion de indice unico
    if (error.name === 'MongoServerError' && error.code ===11000) {
        return next(new Error('ya existe un producto con ese nombre'));
    }
        next(error);
    }
 );

//Exportar el modelo de producto
module.exports = mongoose.model('Product', productSchema);