
//Modelo de movie para la base de datos de mongodb 
const mongoose = require('mongoose')
const movieSchema = new mongoose.Schema({
    title:String,
    director:String,
    year:Date,
    rating:Number,
    important:Boolean
})

//ya que el objeto que devuelve movie en el servidor es complejo y queremos quitar el atributo __v y transformar el atributo _id a id
// pues hay que transformar el metodo toJSON a nuestra conveniencia 
movieSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = Movie 