//ejemplo de como obtener Usuarios de forma asincrona desde la direccion https://jsonplaceholder.typicode.com/users
//y nostrarlos en pantalla

const {Router} = require('express')
const router =  Router()
//instalamos fecth para node con npm i node-fetch@2
const fetch = require('node-fetch') 


router.get('/', async (req, res, next) => {    
  const result = await fetch('https://jsonplaceholder.typicode.com/users')
  const users = await result.json()
  //console.log(users)
  //res.setHeader('Content-Type', 'application/json');
  res.json(users)
  next()    
})

module.exports = router

