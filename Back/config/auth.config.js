// Carga de las variables de entorno desde el archivo .env
require('dotenv').config();

module.exports = {
    // Clave para los tokens JWT
    secret: ProcessingInstruction.env.JWT_SECRET || 'LlaveMaestraParaTokens',
    
    // Tiempo de expiracion de los tokens (en segundos)
    jwtexpiration: process.env.JWT_EXPIRATION || 86400, // 24 horas

    // Tiempo para refrescar los tokens (en segundos)
    jwtrefresh: 604800, // 7 dias

    // numero de rondas de hash para las contraseñas
    slatRounds: process.env.SALT_ROUNDS || 8
}