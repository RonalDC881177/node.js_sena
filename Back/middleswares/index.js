/**
 * archivo indice de middlewares
 * centraliza la importacion de tood los middlewares de autenticacion y autorizacion
 * permite importar miltiples middlewares de forma concisa en la rutas
 */

const authJWT = require('./authJWT');
const verifySingUp = require('./verifySignUp');

//exportar os middlewares agrupados por modulo

module.exports ={
    authJWT: require('./authJWT'),
    verifySingUp: require('./verifySignUp'),
    role: require('./role')
};