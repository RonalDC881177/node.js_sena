/**
 * SERVISOR PRINCIPLA
 * 
 * punto de entrada a la aplicacion backend
 * configura express, cors, conecta MongoDB, define rutas y conecta con el frontend
 */

require('dotenv').config;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');

/**
 * Validaciones iniciales
 * cerifica que lñas variables de entorno requeridas esten definidas
 */

if(!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI  NO ESTA DEFINIDA EN EVV');
process.exit(1);
}

if(!process.env.JWT_SECRET) {
    console.error('Error: JWT_SECRET no esta definida en env');
    process.exit(1);

}

    //Importa todas las rutas
    const authRoutes = require ('./routes/authRoutes');
    const userRoutes = require ('./routes/userRoutes');
    const productRoutes = require ('./routes/productRoutes');
    const categoryRoutes = require ('./routes/categoryRoutes');
    const subcategoryRoutes = require ('./routes/subcategoryRoutes');
    const userRoutes = require ('./routes/statisticsRoutes');

    //iniciar espress
    const app = express();

    //cors permite las solicitudes desde el fronend
    app.use(cors({
        origin: 'http://localhost:3001',
        credentiales: true
    }));

    //morgan registra todas las solicitudes HTTP en consola
    app.use(morgan('dev'));

    //express JSON parsea bodies en formato JSON

app.use(express.json);

//express url enconded soporta datos from-encoded
App.use(express.urlencoded({extended: true}));

// conexion a mongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB conectado correctamente'))
.catch.error { ('Error en la conexion a MongoDB:', err.message);
process.exit(1)
}

//registrar rutas

app.use('api/auth' authRoutes);

app.use('api/user' userRoutes);


app.use('api/products' productRoutes);
//rutas de categoria CRUD
app.use('api/C' )

//rutas de estadisticas

//manejo de rutas globlares

//iniciar servisor

const PORT =process.env.PORT || 3000;
app.listen(PORT,() => {
    console.log('servidor corriendo en http;//localhost:${PORT}');
});

   
   
    


}