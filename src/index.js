require('dotenv').config() // En caso de que queramos usar el archivo .env , es necesario crear esta linea para que pueda leerlo 
require('./mongo') // de esta forma conectamos directamente con mongodb a traves de mongoose.connect en el archivo mongo.js

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const handle_errors = require('./middlewares/handleErrors')
const not_found = require('./middlewares/notFound')


//ojo en package.json en script ponemos a mano   "dev": "nodemon src/index.js" 
//Instalar nodemon: npm install -g nodemon 
// You can also install nodemon as a development dependency:
//  npm install -g nodemon 
//  Para inicializar nodemon tal y como esta configurado: npm run dev
//  Para iniciar sin nodemon : npm run start 


//settings 
app.set('port', process.env.PORT || 3001)  //de esta forma la variable port al numero 3000  para luego en app.listen poder pillar el valor de la variable
//  process.env.PORT o process.env.PORT || 3000 means: whatever is in the environment variable PORT, or 3000 if there's nothing there.
app.set('json spaces', 2) // Los json se ven mas ordenados (prueba a quitar este setting y ver diferencia)



//middlewares
//Los middleware son funciones que se pueden utilizar para manejar objetos de request y response.
//Las funciones de middleware deben utilizarse antes de las rutas si queremos que se ejecuten antes de llamar a los controladores de eventos de ruta.

app.use(morgan('dev')) //permite ver por consola lo que va llegando al servidor
//app.use(morgan('combined')); //daria un mensaje con mas informacion por consola.
app.use(express.urlencoded({ extended:false})) //para recibir datos desde formularios (extended false es para recibi datos basicos de formulario)
app.use(express.json())     //para recibir datos tipo json 
app.use(cors())   //Con ello hacemos que cualquier origen funcione en nuestra api , instalamos con npm install cors -E

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

//IMPORTANTE: 
//Middleware para el caso hacer una request que no existe: Ejemplo hacemos un get http://localhost:3001/api/adfadf, el resultado 
//seria Cannot GET /api/adfadf . SI queremos que no aparezca: ponemos este middleware
app.use(not_found);

//Ejemplo de middleware para el manejo de errores que usaremos en los metodos router.get('/:id',(req,res,next) y router.delete() del archivo movies.js
app.use(handle_errors)


//para que entre aqui, habria que poner next en 
// app.use(()=>{
//     console.log('He entrado aqui');
// })


//  starting the server
//  app.listen(3000, ()=> {  
//     console.log(`Server on port ${3001}`)
// })

app.listen(app.get('port'), ()=> {  
  console.log(`Server on port ${app.get('port')}`)
})


