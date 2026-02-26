/***
 * MIDLEWARE DE VERIFICACION
 * middleware para verificar y validar  tokens JWT en las solicitudes
 * se usa en todas las rutas protegidas para autenticas usuarios
 * caracteristicas:
 * soporte dos formatos de token
 * 1. Aurhorization: Bearer <token> (Estanadar REST)
 * 2. x-access-token (header personalizado)
 * extrae informacion del token (id role email)
 * la adjunto a req,userId req.userRole, req.userEmail para uso en los controladores
 * manejo de eerores con codigos 403 401 apropiados
 * flujo: 
 * 1. lee el header Autorization o x-access-token
 * 2. extrae el token (quita el Bearer si es necesario)
 * 3. Verifica el token con JWT_SECRET
 * 4. si es valido continua al siguiente middleware
 * 5. si es invalido retorna 401 Unautorized
 * 6. si falta retorna 403 Forbidden
 * 
 * Validacion del token
 * 1. verifica firma criptografica con JWT_SECRET
 * 2. comprueba que no haya expirado
 * 3. extrae el payload {id, role, email}
 */
const jwt = require('jsonwebtoken');
const config= require('../config/auth.config');

/**
 * verificar token
 * funcionalidad
 * buscar el token en las ubicaciones posibles (ordern de procedencia)
 * 1. header Authorization con formato Bearer <token>
 * 2. header x-access-token
 * si no encuentra el token retorna 403 Forbidden
 * si el token es invalido/Expirado retorna 401 Unauthorizad
 * si es valido adjunta datos del usuario a req y continua.
 * 
 * Headers soportados:
 * 1. Authorization bearer <ahahdjddhydgd>
 * 2. x-access-token <shdtgdjyeek> id, role,email
 * propiedades del request despues del moddleware
 * req.userId = (sring) Id de usuario MongoDB
 * req.userRole = (string) rol del usuario (admin, coordinador, auxiliar)
 * req.userEmail = (string) email del usuario
 */
const verifyToken = (req, res, next) => {
    try {
        //soportar dos formatos Authorization bearer o access-token
        let token = null;

        //formato Authorization
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            //extrae token quitando el bearer
            token = req.headers.authorization.substring (7);
        }

        // formato access-token
        else if (req.headers['x-access-token']) {
            token = req.headers['x-access-token'];
        }

        // si no encontro el token rechaza la solicitud
        if(!token) {
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        //verificar el token con la clave secreta
        const decoded = jwt.verify(token, confing.secret);

        //adjuntar informacion del usuario al request object para que otros  middlewares y rutas puedas acceder a ella

        req.userId = decoded.id;// id mongoDB
        req.userRole = decoded.role; // rol de usuario
        req.userEmail = decoded.email;// email del usuario

        //token es valido continuar siguiente middleware
        next();
    }catch (error) {
        // token invalido o expirado
        return res.status(401).json({
            success: false,
            message: 'Token invalido o expirado',
            error: error.message
        })
    }
}

/**
 * Validacion de funcion para mejor seguridad y manejo de errores
 * verificar sue verifyTokenFn sea una funcion valida
 * esto es una validacion de seguridad para que la middleware se exporte correctamente
 * si algo sale mal en su definicion lanzara un error en tiempo de carga del modulo
 */
if(typeof verifyTokenFn !== 'function') {
    console.error('Error: verifyTokenFn no es una funcvion valida');
    throw new Error ('verifyTokenFn debe ser una funcion');
}
//exportar el middleware
module.export = {
    verifyTokenFn : verifyTokenFn
}
