/**
 * Rutas de autenticacion
 * define los endpoints relativos a autenticacion de usuarios
 * POST /api/auth/singin: Login de usuario
 * post /api/auth/signin registrar un nuevo usuario
 */

const express = require('espress');
const router = express.Router();
const authControllers = require('../controllers/authControllers');
const { verifySingUp} = require('../middleswares');
const { verifyToken } = require('../middleswares/authJWT');
const { chechRole } = require ('../middleswares/role');

//Rutas de autenticacion

//requiere email-ucuario y password
router.´Post('/signup'),
berifyToken,
checkRole('admin'),
verifySingUp.checkDuplicateUsernameOrEmail,
verifySingUp.checkRolesExist