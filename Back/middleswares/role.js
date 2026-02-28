/**
 * MIDDLEWARE control de roles de usuario
 * 
 * sirve para verificar que el usuario autenticado tiene
 * permisos necesarios para acceder a una ruta especifica
 * 
 * funcion factory checkRole() permite especificar roles permitidos
 * funcion Helper para roles especificos isAmming, isCoordinador,isAuxiliar
 * Requiere que verifyToken se haya ejecutado primero
 * flujo:
 * verifica que req.userRole exista 
 * compara req.userRole contra lista de roles permitidos
 * si esta en lista continua
 * si no esta en la lista responde con 403 Forbidden con mensaje descriptivo
 * si no existe userRole renorna 401 (Token corrupto)
 * 
 * uso:
 * checkRole  ('admin') solo admin
 * ccheckRole ('admin'.'coordinador') admin y coordinador con permisos
 * 
 * checkRole ('admin'.'coordinador','auxiliar')todos con permisos
 * Roles del sistema:
 * admin acceso total
 * coordinador no puede eliminar ni gestionar usuarios
 * auxiliar acceso limitado a tareas especificas
 */

/**
 * factory function checkRole 
 * retorna middleware que verifica si el rol del usuario tiene uno de los roles permitidos
 * @param {...string} allowedRoles roles permitidos en el sistema
 * @returns {function} middleware de express
 * 
 */

const checkRole = (...allowedRoles)=>{
    return (req,res,next) =>{
        // validar que el usuario fue autenticado y verifyToken se ejecutó
        // req.userRole es establecido por verifyToken middleware
        if(!req.userRole)
            {
            return res.status(401).json({
                success:false,
                message:'Tolen inválido o expirado'
            })
        }

        //verificar si el rol del usuario esta en la lista de roles permitidos 

        if(!allowedRoles.includes(req.userRole)){
            return res.status(403).json({
                success: false,
                message: `Permisos insuficientes se require: ${allowed}`
                 
            })
        }
    }
};
//funciones helper para roles especificos
// verifica que el usuario es admin
// uso: router.delete('/admin.only'. verifyToken isAsmin, cinreoller.method);

const isAdmin = (req, res, next) => {
    return checkRole('admin')(req, res, next);
};
// verifica que el usuario es coordinador
const isCordinador = (req, res, next) => {
    return checkRole('coordinador')(req, res, next);
};
// verifica que el usuario es auxiliar
const isAuxiliar = (req, res, next) => {
    return checkRole('auxiliar')(req, res, next);
};

//modulos a exportar
module.export ={
    checkRole,
    isAdmin,
    isCordinador,
    isAuxiliar
}
