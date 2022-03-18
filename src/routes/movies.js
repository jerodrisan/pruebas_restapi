const {Router} = require('express')
const router = Router()

const movies = require('../datos/sample-movies.json')
const Movie = require('../models/Movie') //importamos el modelo Movie para usar Mongodb

//Generacion automatica de ids . 
const generateId = () => {
  const maxId = movies.length > 0
    ? Math.max(...movies.map(n => n.id))
    : 0
  return maxId + 1
}


router.get('/',(req,res)=>{    
  //opcion si pillamos las movies desde la base de datos en la nube
  Movie.find({})
  .then(movies =>{      
    console.log(movies)
    res.json(movies)
  })
  .catch(err => console.log(err))

  //Opcion si pillamos las movies del sample-movies en local 
  //res.json(movies)
})


//En caso de usar una ID que no corresponde, para el manejo de errores utilizaremos middlewares con next 
router.get('/:id',(req,res,next)=>{    
  // si envio una peticion get desde navegador o desds postmant (http://localhost:3001/api/movies/1) 
  console.log(req.params)  // { id: ':1' }   
  console.log(req.body)   // {} o el objeto que pongamos en el body si es desde postman. Al ser un get, usamos req.params  

  //OPCION A: si hacemos el get desde la base de datos mongodb: En este caso la id es un string alfanumérico
  //Movie.find({id:req.params.id}).then(movie=> console.log(movie)).catch(err=> console.log(err)) . Usaremos MEJOR findById:
  Movie.findById(req.params.id)
  .then(movie=>{
    if(movie){
      console.log(movie)
       res.status(200).json(movie)
    }else{
      res.status(404).end()
    }    
  })
  .catch(err=>{
    //Imaginemos que ponemos una id erronea alfanumerica, pues usaremos next , es decir, middlewares, en vez del codigo de abajo
    // para el manejo de errores. Este next lleva al siguiene middleware que maneja un error que esta en index.js, en concreto el handleErros.js , 
    // ya que es un next con parametro (next(err))     
    next(err)   
    // console.log(err)
    // res.status(400).end() 
  })    

  // //OPCION B: de hacer el get desde el archivo sample-movies.json
  /* const movie = movies.find(m=>m.id===req.params.id) 
  res.json(movie) */


})


router.post('/',(req,res)=>{  
  const reqbody = JSON.stringify(req.body)
  console.log(` Este es el req.body pasado a string ya que es un JSON ${reqbody}`)   
  //enviamos en postman en el Body raw y JSON y en los Headers: Content-Type: application/json
  const {title, director, year, rating, important} = req.body //req.body es un JSON
  //Se puede usar una libreria para comprobar que se reciben los datos como express validartor
  if(title && director && year && rating ) {

    // OPCION de querer hacer post en el servidor de mongodb: Creamos la nueva movie con el modelo Movie 
    //No ponemos la id ya que esta la va a generar automanticamente mongodb en el servidor. 
    const newMovie_mdb = new Movie({
      title:req.body.title,
      director:req.body.director,
      year:req.body.year,
      rating:req.body.rating,
      important:req.body.important 
    })
    newMovie_mdb.save()
    .then(movie =>{
      console.log(movie)
      res.status(200).json(movie)
    })
    .catch(error => console.log(error))


    //OPCION de hacer el post en el archivo sample-movies.json:
    //const id = movies.length+1
    /* const id = generateId()   //mejor forma de generar la id que la forma anterior
    const newMovie = {id,...req.body}
    console.log(newMovie) 
    movies.push(newMovie)
    //res.send('saved')
    res.status(200).json(movies) //envio al cliente las peliculas actualizadass */

  }else{
    //res.send('wrong request')
    res.status(500).json({error:'There was an error'})
  }    
})



router.delete('/:id', (req,res, next) => {
  const { id } = req.params //ojo el numero que se pone en el id es siempre un String , ojo con las conversiones
  console.log(`el id es ${id} y el tipo de dato es ${typeof id}`) //tipo de dato en el request es String 
  //console.log(req.params)

  //OPCION A: En caso de borrar un registro en en servidor mongodb 
  Movie.findByIdAndDelete(id)
  .then(result=>{
    console.log(result)
    res.status(204).end()

  })
  .catch(err=>{
    next(err) //nos lleva al siguiente middleware que maneja un error que es el handleErrors.js de index.js
  })

  //OPCION B : En caso de querer borrar un registro en el archivo sample-movies.json ( En realidad no lo borraria, haria un filtro)
  /*   if(id){        
    const movie = movies.find(movie => movie.id === id)  //fjarse que el tipo de dato de id en e sample.json tambien es String
    //Para pasarlo a numero seria Number(id) o Number(movie.id)
    if (!movie) {
      return res.status(404).json({success: false, message:`no movie with id ${id}`})
      //o bien return res.status(404).end()
    } 
    const newMovies = movies.filter(movie => movie.id !== id)
    console.log(`las movies son ${JSON.stringify(newMovies)}`)
    return res.status(200).json({newMovies})     
  }    */
})




router.put('/:id', (req, res, next) => {

  const {id} = req.params
  
  const newMovie = {
    title : req.body.title,
    director : req.body.director,
    year : req.body.year,
    rating : req.body.rating,
    important : req.body.important
  }
  
  //OPCION A: Editamos la movie con id que queramos en el servidor mongo
  Movie.findByIdAndUpdate(id, newMovie, {new:true})
  .then(result=>{    
    //OJO En caso de no poner el tercer parametro {new:true} daria como resultado el registro que ha encontrado por id, no el que hemos actualizado 
    res.json(result) 
  })
  .catch(err => {
    console.log(err.name)
    next(err)
  })




  // OPCION B: Editamos la movie en el archivo sample-movies.json. Realmente lo que hacemos es mapear el arrray de movies para dar el resultado
  /* const {title, director, year, rating, important} = req.body   
  if(title && director && year && rating){
    const movie = movies.find(movie => movie.id === id)
    if (!movie) {
      return res.status(404).json({success: false, message:`no movie with id ${id}`})  //o bien return res.status(404).end()
    }         
    const newMovie = movies.map((movie) => {            
      if(movie.id === id){                
        movie.id = id
        movie.title = title
        movie.director = director
        movie.year = year
        movie.rating = rating
        movie.important= important
      }
      return movie
    })        
    return res.status(200).json({success: true, message:newMovie})
  } */

})




module.exports = router