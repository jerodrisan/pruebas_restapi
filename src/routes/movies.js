const {Router} = require('express')
const router = Router()

const movies = require('../datos/sample-movies.json')

//Generacion automatica de ids . 
const generateId = () => {
  const maxId = movies.length > 0
    ? Math.max(...movies.map(n => n.id))
    : 0
  return maxId + 1
}


router.get('/',(req,res)=>{    
  res.json(movies)
})

router.get('/:id',(req,res)=>{    
  // si envio una peticion get desde navegador o desds postmant (http://localhost:3000/api/movies/1) :
  console.log(req.params)  // { id: ':1' }   
  console.log(req.body)   // {} o el objeto que pongamos en el body si es desde postman
  const movie = movies.find(m=>m.id===req.params.id) 
  res.json(movie)
})


router.post('/',(req,res)=>{  

  console.log(req.body) 
  //enviamos en postman en el Body raw y JSON y en los Headers: Content-Type: application/json
  const {title, director, year, rating} = req.body
  //Se puede usar una libreria para comprobar que se reciben los datos como express validartor
  if(title && director && year && rating){
    //const id = movies.length+1
    const id = generateId()   //mejor forma de generar la id que la forma anterior
    const newMovie = {id,...req.body}
    console.log(newMovie)
    movies.push(newMovie)
    //res.send('saved')
    res.status(200).json(movies) //envio al cliente las peliculas actualizadass
  }else{
    //res.send('wrong request')
    res.status(500).json({error:'There was an error'})
  }    

   


})

router.delete('/:id', (req,res) => {
  const { id } = req.params //ojo el numero que se pone en el id es siempre un String , ojo con las conversiones
  console.log(`el id es ${id} y el tipo de dato es ${typeof id}`) //tipo de dato en el request es String 
  //console.log(req.params)
  //res.send("deleted") //mostraria en navegador el objeto que queremos eliminar por ejemplo {id:1}   
  if(id){        
    const movie = movies.find(movie => movie.id === id)  //fjarse que el tipo de dato de id en e sample.json tambien es String
    //Para pasarlo a numero seria Number(id) o Number(movie.id)
    if (!movie) {
      return res.status(404).json({success: false, message:`no movie with id ${id}`})
      //o bien return res.status(404).end()
    } 
    const newMovies = movies.filter(movie => movie.id !== id)
    console.log(`las movies son ${JSON.stringify(newMovies)}`)
    return res.status(200).json({newMovies})     
  }   
})

router.put('/:id', (req, res) => {

  const {id} = req.params
  const {title, director, year, rating} = req.body   
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
      }
      return movie
    })        
    return res.status(200).json({success: true, message:newMovie})
  }

})

module.exports = router