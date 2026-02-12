/**
 * Modelo de subcategoria MongoDB
 * Define la estructura de la subcategoria
 * La subcategoria depende de una categoria.
 * Muchaos productos pudebn pertenecer a una subcategoria.
 * Muchas subcategorias dependen de una sola categoria.
 */

const mongoose = require('mongoose');

//Campos de la tabla subcategoria
const subcategorySchema = new mongoose.Schema({
    //nombre de la subcategoria unico y requerido
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,//No pueden haber dos subcategorias con el mismo nombre
        trim: true,//Eliminar espacios al inicio y al final
    },

    //Descripcion de la subcategoria opcional
    description: {
        type: String,
        required: [true, 'La descripcion es obligatoria'],
        trim: true,
    },

    //Categoria padre esta subcategoria perteneca a una categoria
    // relacion 1 - muchos Una categoria puede tener muchas subcategorias

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Puede ser poblado con -populate ('category')
        required: [true, 'La categoria es obligatoria']
    },


    //Active desactiva la subcategoria pero no la elimina.
    active: {
        type: Boolean,
        default: true, // por defecto la subcategoria esta activa
    },
}, {
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
 subcategorySchema.post('save', function(error, doc, next) {

    //verificar si es error de mongoDB por violacion de indice unico
    if (error.name === 'MongoServerError' && error.code === 1000) {
        next(new Error('ya existe una subcategoria con ese nombre'));
    } else {
        //Pasar error tal como es
        next(error);
    }


}),

//Exportar el modelo de subcategoria
module.exports = mongoose.model('Subcategory', subcategorySchema);