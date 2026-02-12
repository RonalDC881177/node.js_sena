/**
 * Modelo de subcategoria MongoDB
 * Define la estructura de la subcategoria
 * La subcategoria depende de una categoria.
 * Muchaos productos pudebn pertenecer a una subcategoria.
 * Muchas subcategorias dependen de una sola categoria.
 */

const mongoose = require('mongoose');

//Campos de la tabla categoria
const categorySchema = new mongoose.Schema({
    //nombre de la categoria unico y requerido
    name: {
        type: String,
        required: [true,'El nombre es obligatorio'],
        unique: true,//No pueden haber dos categorias con el mismo nombre
        trim: true,//Eliminar espacios al inicio y al final
    },

    //Descripcion de la categoria opcional
    description: {
        type: String,
        required: [true,'La descripcion es obligatoria'],
        trim: true,
    },

    //Categoria padre esta categoria perteneca a una categoria
    // relacion 1 - muchos Una categoria puede tener muchas categorias

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Puede ser poblado con -populate ('category')
        required:[true, 'La categoria es obligatoria']
    },


    //Active desactiva la subcategoria pero no la elimina.
    active: {
        type: Boolean,
        default: true, // por defecto la categoria esta activa
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
 categorySchema.pre('save', async function (next) {
    try {
        //optener referencia de la colesccion de mongoDB
        const collection = this.constructor.collection;

        //obtener lista de todos los indices de la coleccion
        const indexes = await collection.indexes();

        //Buscar si existe un indice problematico con el nombre 'name_1'
        //(del orden: 1 significa ascendente)
        const problematicindex = indexes.find(index => index.name === 'name_1');
        if (problematicindex) {
            //si existe el indice problematico, eliminarlo
            await collection.dropIndex('name_1');
            console.log('Índice problemático "name_1" eliminado correctamente.');
        }
    } catch (error) {
       
    }


 }),

 module.exports = mongoose.model('Category', categorySchema);