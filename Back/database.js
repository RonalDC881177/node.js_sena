/**
 * Modulo de conexion a la base de datos MongoDB
 * 
 * este archivo maneja la conexion de la base de datos a MongoDB utilizando el paquete de Mongose
 * establece la conexion con la base de datos
 * configura las opciones de conexion 
 * maneja los errores de conexion
 * exporta la funcion connectDB para usarla en server.js
 */

const mongoose = require('mongoose');
const { DB_URI } = process.env;

const connectDB = async () => {
    try{
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTpology: true,
        });

        console.log('ok MongoDB conectado')
    } catch (error) {
        console.error('X error de conexion a MongoDB:' error.mensagge)
    }
    )
}