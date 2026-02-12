/**
 * Archivo de indice de los modelos
 * Este archivo centraliza la importacion de los modelos a mongoose
 * Permite importas modelos de foma concisa en otros archivos
 */

const User = require('./User');
const Product = require('./Products');
const Category = require('./Category');
const Subcategory = require('./Subcategory');

//Exportar todos los modelos

module.exports ={
    User,
    Product,
    Category,
    Subcategory
};