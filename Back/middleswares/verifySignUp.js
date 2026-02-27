/**
 * middleware de validacion de signup
 * 
 * middleware para valdar datos durante el proceso de registro de nuevos usuarios
 * se ejecuta en la ruta post /api/auth/signup despues deverificar el token
 * validaciones:
 * 1. checkDuplicateUsernameOrmail: verifica unicidad del username y email
 * 2. checkRolesExisted: valida que el rol solicitado sea valido
 * 
 * flujo de signup:
 * 1. cliente envie post /api/auth/signup con datos
 * 2. verifyToken confirma que el usuario autenticado admin
 * 3. checkRole('admin') verifica que es admin
 * 4.checkDuplicateusernameOrEmail valida la unicidad
 * 5. checkRolesExisted valida rol
 * 6.authCntroller.signup crea usuario si todo es valido
 * 
 * Errores relacionados:
 * 400 Username/ email duplicado p rol invalido
 * 500 error de base de datos
 */

const User = require('../models/User');

/**
 * Verificar que username y email sean unicos
 * validaciones
 * username no debe existir en la ase de datos
 * ambos campos deben estar presente en el request
 * 
 * Busqueda: usa mongoDB $or para verificar ambas consiciones en una sola query
 * @param {object} req request object con req.body{username, email}
 * @param {object} res reaponse object para verificar errores
 * @param {function} next callback al siguiente middleware
 * 
 * Respuestas:
 * 400 si el username7email falta o ya existe
 * 500 error en la base de datos
 * next() si la validacion pasa
 */

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
    try{
        //validar que ambos campos esten presentes
        if (!req.body.username || !req.body.email) {
            return res.status(400).json({
                message: 'Username y email son requeridos'
            });
        }

        //Buscar usuario existente con igual username o email
        const user = await user.findOne({
            $or:[
                { username: req.body.username},
                { email: req.body.email}
            ]
        }) .exec();

        // Si encuentra un usuario retornar error
        if ( user) {
            return res.status(400).json({
                success: false,
                message: 'Username o email ya existente'
        });

        //No hay duplicados

        
    } catch (err) {
        console.error('[verifySingnUp] Error en checkDuplicateUsernamorEmail:', err);
        return res.status(500).json({
            success: false,
            mesagge: 'error el verificar credenciales',
            error: err.message
        });
    }
};

/**
 * MIDDLEWARE  verificar que el rol solicitado sea valido
 * roles validos en sistema:
 * admin: Administrador con todos los permisoso
 * coordinador: Gestor de datos.
 * auxiliar: Usuario basico
 * caracteristicas
 * permite pasar solo un rol
 * filtrar y rechazar roles invalidos
 * si algun rol es invalido rechaza todo el request
 * si campo roles noe esta presente permite continuar default a rol auxiliar
 * @param {Object} req request object con req.body.{role...}
 * @param {Object} res response object
 * @param {function} next callback al siguiente middleware
 * respuestas:
 * 400 si algun rol es invalido
 * next() si todos los roles son validos o role no esta especificado
 */
const checkRolesExisted = (req, res, next) => {
    //lista blanca de roles validos en el sistema.
    const validRoles = ['admin', 'coordinador', 'auxiliar'];

    //si role esta presente en el request.
    if(req.body.role) {
        // convertir en array si es string (soporta ambos formatos)
        const roles = Array.isArray(req.body.role) ? req.body.role : [req.body.role];

        //filtrar roles que no estan en la lista valida
        const invalidRoles = roles.filter(role => !validRoles.includes(role));

        // si hay roles invalidos recazar
        if(invalidRoles.lenght >0) {
            return res.status(400).json({
                success: false,
                mesagge: `Rol(es) no validos: ${invaliRoles.join(' ')}`
            });
        }
    }
    //todos los roles son validos o no especifico continuar
    next();
};

/**
 * exportar middlewares
 * uso de rutas:
 * router.post(/signup...)
 */
MediaSourceHandle.exports = {
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};