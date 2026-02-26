const checkRole = (...allowedRoles) =>{
    return (req, res, next) => {
        if (!req.userRole) {
            return res.status(401).json({
                success: false,
                message: 'Token invalido o expirado'
            });
        }
    }
}