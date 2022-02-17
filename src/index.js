const express = require('express');
const app = express();
const morgan = require('morgan');
//ojo en package.json en script ponemos a mano   "dev": "nodemon src/index.js" 

//settings 
app.set('port', process.env.PORT || 3000);  //de esta forma la variable port al numero 3000  para luego en app.listen poder pillar el valor de la variable
//  process.env.PORT o process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
app.set('json spaces', 2); // Los json se ven mas ordenados (prueba a quitar este setting y ver diferencia)



//middlewares
//Los middleware son funciones que se pueden utilizar para manejar objetos de request y response.
//Las funciones de middleware deben utilizarse antes de las rutas si queremos que se ejecuten antes de llamar a los controladores de eventos de ruta.

app.use(morgan('dev')); //permite ver por consola lo que va llegando al servidor
//app.use(morgan('combined')); //daria un mensaje con mas informacion por consola.
app.use(express.urlencoded({ extended:false})); //para recibir datos desde formularios (extended false es para recibi datos basicos de formulario)
app.use(express.json())     //para recibir datos tipo json 


//routes
app.use(require('./routes/products'));
app.use('/api/movies',require('./routes/movies'))
app.use('/api/users', require('./routes/users') );




//  starting the server
//  app.listen(3000, ()=> {  
//     console.log(`Server on port ${3000}`)
// })

app.listen(app.get('port'), ()=> {  
    console.log(`Server on port ${app.get('port')}`)
})


