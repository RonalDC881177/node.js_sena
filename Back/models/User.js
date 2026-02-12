// modelo de usuario

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { use } = require('react');

// estructura del usuario
const UserSchema = new mongoose.Schema({
    // definimos los campos del usuario
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true // Elimina espacios en blanco al inicio y al final
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // convierte en minúsculas
        trim: true, // Elimina espacios en blanco al inicio y al final
        match: [/\S+@\S+\.\S+/, 'El correo electrónico no es válido'] // Validación de formato de correo electrónico    

    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // No incluir el campo password en las consultas por defecto
    },
    DOB: {
        type: Date,
        required: true
    },
    datecreation: {
        type: Date,
        default: Date.now
    },
    rol: {
        type: String,
        enum: ['Admin', 'coordinador', 'auxiliar'],
        default: 'auxiliar'
    },
    status: {
        type: Boolean,
        default: true // El usuario está activo por defecto
    },
},
    {
        timestamps: true, // Agrega campos createdAt y updatedAt automáticamente
        versionKey: false // Elimina el campo __v que Mongoose agrega por defecto
    }
);

UserSchema.pre('save', async function (next) {
    try {
        // Solo hashea la contraseña si ha sido modificada o es nueva
        const salt = await bcrypt.genSalt(10);

        // encripta la contraseña
        this.password = await bcrypt.hash(this.password, salt);

        // continúa con el siguiente middleware o guarda el documento
        next();

    } catch (error) {
        // si ocurre un error, pásalo al siguiente middleware de manejo de errores
        next(error);
    }
});

// crear y exportar el modelo de usuario
module.exports = mongoose.model('User', UserSchema);