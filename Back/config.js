/**
 * Archivo de configuracion contral del backend.
 * Este archivo centraliza todas las configuraciones principales de la aplicacion
 * configuracion de JWT tokens de autenticacion
 * configuracion de conexion a MongoDB
 * definicion de roles del sistema
 * 
 * las variables de entorno tienen prioridad los valores por defecto
 */
module.exports = {
    //configuracion del JWT
    SECRET: process.env.JWT_SECRET || 'tusecretoparalostokens',
    TOKEN_EXPIRATION: process.env.JWT_EXPIRATION || '24h',

    //configuracion de la base de datos
    DB_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/crud-mongo',
    DB: {
        URL: process.env.MONGO_URI || 'mongodb://localhost:27017/crud-mongo',
        OPTIONS: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },

    //Roles del sistema
    ROLES: {
        ADMIN: 'admin',
        COORDINADOR: 'coordinador',
        AUXILIAR: 'AUXILIAR'
    }
};
