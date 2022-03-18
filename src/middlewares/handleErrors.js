 module.exports = (error, req, res, next)=>{
    console.error(error)
    console.log(error.name)
    if(error.name=='CastError'){
      res.status(400).send({error: 'id used is malformed'}) // //En caso de poner una id erronea , saldra CastError
      //res.status(400).end()
    }else{
      res.status(500).end() //En este caso seria error  nuestro
    }
  }