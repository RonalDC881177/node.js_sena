/**
 * Controlador de usuarios.
 * Este modulo maneja todas las operaciones del crud para gestion de usuarios.
 * Incluye control de accesos basado en roles.
 * Roles permitidos: admin y coordonador.
 * seguridad.
 * Las contraseñas nunca se devuelven en respuestas.
 * Los auxiliares no pueden ver y administrar otros usuarios.
 * Los coordinadore no pueden ver los administradores.
 * activas y desactivas usuarios.
 * eliminar érmanentemente un usuario solo para administradores.
 *
 * operaciones:
 * getAlluser listar usuarios con filtro por rol.
 * getUserById obtener usuarios especificos.
 * createUser crear un nuevo usuario con validacion.
 * updateUser actualizar usuario con restriccion de rol.
 * deleteUser eliminar usuario con restriccion de rol.
 *
 */

const User = require("../models/User");
const bcrypt = require("bcryptjs");

/**
 * Obtener lista de usuarios.
 * GET/ api/ users
 * Auth token requerido.
 *
 * retorna:
 * 200: array de usuarios filtrados
 * 500: Error de servidor.
 */

exports.getAllUsers = async (req, res) => {
    try {
        //Por defecto solo mostrar usuarios activos.
        const includeInactive = req.query.includeInactive === "true";
        const activeFilters = includeInactive ? {} : { active: { $ne: false } };

        let users;
        // contral de acceso basado en el rol.
        if (req.userRole === "auxiliar") {
            //Los auxiliares solo pueden verse a si mismos.
            users = await User.find({ _id: req.userId, ...activeFilter }).select(
                "-password",
            );
        } else {
            //Los admin y coordinadores  pueden ver a todos los usuarios.
            users = await User.find(activeFilters).select("-password");
        }
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("[CONTROLLER] error en getAllUsers: ", error.message);
        res.status(500).json({
            success: false,
            message: "Error al obtener todos los usuarios.",
        });
    }
};

/**
 * Read obtener un usuario especifico por id.
 * GET /api/users/:id
 * Auth token requerido.
 * retorna:
 * 200: Usuario encontrado.
 * 403: Sin permiso para ver este usuario.
 * 404: Usuario no encontrado.
 * 500: Error en el servidor.
 */

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado.",
            });
        }

        //validaciones de acceso
        // Los auxiliares solo puede ver su propio perfil.
        if (req.userRole === "auxiliar" && req.userId !== user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "No tienes permiso para ver este usuario.",
            });
        }

        //Los coordinadores no pueden ver administradores.
        if (req.userRole === "coordinador" && role === "admin") {
            return res.status(403).json({
                success: false,
                message: "No puedes ver usuarios administradores.",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Eror en getUserById:", error.message);
        res.status(500).json({
            success: false,
            message: "Error al obtener el usuario.",
            error: error.message,
        });
    }
};
