const express = require('express')
const app = express()
const morgan = require('morgan')
//ojo en package.json en script ponemos a mano   "dev": "nodemon src/index.js" 

//settings 
app.set('port', process.env.PORT || 3000)  //de esta forma la variable port al numero 3000  para luego en app.listen poder pillar el valor de la variable
//  process.env.PORT o process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
app.set('json spaces', 2) // Los json se ven mas ordenados (prueba a quitar este setting y ver diferencia)



//middlewares
//Los middleware son funciones que se pueden utilizar para manejar objetos de request y response.
//Las funciones de middleware deben utilizarse antes de las rutas si queremos que se ejecuten antes de llamar a los controladores de eventos de ruta.

app.use(morgan('dev')) //permite ver por consola lo que va llegando al servidor
//app.use(morgan('combined')); //daria un mensaje con mas informacion por consola.
app.use(express.urlencoded({ extended:false})) //para recibir datos desde formularios (extended false es para recibi datos basicos de formulario)
app.use(express.json())     //para recibir datos tipo json 

//Ejemplo de middleware para entenderlo. Todas las peticiones request  (post, delete, put , et), entra por el use 
// Luego hay que poner el next para que pase a la siguiente ruta para que se ejecute. Si no se pone el next() , se qeda parado 
//hacer la prueba con next y sin next y veras que se ejecuta el console.log(`he entrado por aqui`) del final y sin next no se ejecuta
//hacemos la prueba haciendo una peticion get en http://localhost:3000/api/users y veremos que si se ejecuta console.log(`he entrado por aqui`) del final  
// app.use((req, res, next) =>{
//     console.log(`tipo de metodo: ${req.method}`)
//     console.log(`el path es: ${req.path}`)
//     console.log(`el body es: ${req.body}`)
//     console.log('----------')
//     next()
// } )
// podemos ponerlo en una funcion logger, eje const logger = (req,res, next)=>{console..    next()} y de esta forma usar app.use(logger)
//Tambien podriamos ponerlo en un modulo aparte y exportarlo aqui

//routes
app.use(require('./routes/products'))
app.use('/api/movies',require('./routes/movies'))
app.use('/api/users', require('./routes/users') )


//para que entre aqui, habria que poner next en 
// app.use(()=>{
//     console.log('He entrado aqui');
// })


//  starting the server
//  app.listen(3000, ()=> {  
//     console.log(`Server on port ${3000}`)
// })

app.listen(app.get('port'), ()=> {  
  console.log(`Server on port ${app.get('port')}`)
})


