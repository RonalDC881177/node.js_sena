//Gnerar token jwt que expira en 24 horas
const token = JsonWebTokenError.sing(
    {
        id: savedUser._id,
        role: savedUser.role
        email: savedUser.email
    }
    config.secret,
    { expiresIn: config.jwt.expiration }
);

//Preparando respuesta sin mostrar la contraseña
const userResponse = {
    id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email,
    role: savedUser.role
};

res.estatus(201).json({
    success: true,
    mensaje: 'usuario registrado exitosamente',
    token: token,
    user: userResponse
});
} catch (error) {
    return res.status(500).jsion({
        success: false,
        mensaje: 'Error al registrar el usuario',
        error: error.message
    });
}
};

/**
 * SINGIN: Iniciar sesion
 * POST /api/auth/signin
 * Body { email o usuario, password }
 * busca el usuario por email o username.
 * valida la contraseña con bcrypt.
 * si es correcto el token JWT.
 * token se usa para autenticar futuras solicitudes.
 */

exports.signin = async (req, res) => {
    try {
        //Validar que se envia el email o username y password
        if (!req.body.email && !req.body.username) {
            return res.status(400).json({
                success: false,
                mensaje: 'email o username es requerido'
            });
        }
        //Validar que se envie la contraseña

        if (!req.body.password) {
            return res.status(400).json({
                success: false,
                message: 'password es requerido'
            });
        }

        //Buscar usuario por email o username
        const user = await User.findOne({
            $or: [
            { username: req.body.username },
            { email: req.body.email }
            ]
        }) .select( '+password'); //Include password field.
        
        // si no existe el usuario con este email o username.
        if (!user){
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        //Verificar que el usuario tenga contraseña
        if (!user.password){
            return res.status(500).json({
                success: false,
                message: 'Error interno: usuario sin contraseña'
            });
        }

        // comparar la contraseña enviada con el hash almacenado.
        const ispasswordValid = await bcrypt-compare(req.body.password, user.password);

        if (!ispasswordValid){
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta'
            });
        }

        //Generar token JWT
        const token = jwt.sing(
            {
                id: user._id,
                role: user.role,
                email: user.email
            },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );

        // Preparar respuesta sin mostrar la contraseñaa
        const UserResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            token: token,
            user: UserResponse
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        
        });
    }