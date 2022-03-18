
const mongoose = require('mongoose')
//Pillamos el conection string desde atlas donde pone connect to cluster() y ahi connect your aplication
const password = require('../passwords')
const conectionString  = `mongodb+srv://Jerosan:${password}@cluster0.0sbav.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
//const conectionString = process.env.MONGO_DB_URI // En caso de que queramos usar variable de entorno y guardar ahi la contraseña y la URI ( en arvhivo .env)
const Movie = require('./models/Movie') 

// prueba de conexion con mongodb

mongoose.connect(conectionString).
then(()=>{
    console.log('database conected')
}).catch(err =>{
    console.error(err)
})


//Para probar en linea de consola, vamos al directorio src y en linea de comandos ponemos node mongo.js y deberia de poner database conected
//Creamos los esquemas (OJO , este esquema es a nivel de esta aplicacion , establece las normas para introducir los datos en la base de datos,
//pero solo a nivel de aplicacion. LUego puedes ir a Robo3t y poner los datos como quieras.)
//Cuando creemos una movie por esta app, tendra que seguir este esquema. 
//Los esquemas los creamos en la carpeta models, en ese caso para hacer las pruebas , creamos el esquema Movie y lo exportamos aqui para hacer
//pruebas de que todo funciona: Ejemplo de meter una nueva movie y luego buscarla en la base de datos: 

//Creamos una nueva movie: 

/* const movie = new Movie({
    title:"perros callejeros",
    director:"pepe y manolo",
    year:new Date(),
    rating:5,
    important:true    
})

// Si queremos guardar le pelicula en la base de datos. Mogoose al guardarlo devuelve una promesa
movie.save()
.then(result => {
    console.log(result) //devuelve el objeto que hemos enviado a la base de datos. 
    mongoose.connection.close() //cerramos la conexion con la base de datos. 
})
.catch(err => {console.log(err)})

//Tambien podemos buscar el dato que queramos: En este caso vemos todas las colecciones con el metodo find({})
Movie.find({}).then(res =>{
    console.log(res)
    mongoose.connection.close() //cerramos la conexion con la base de datos
}).catch(err => {console.log(err)}) */



