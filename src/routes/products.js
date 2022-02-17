const {Router} = require('express');
const router = Router();

let {products} = require('../datos/sample-products');

router.get('/', (req,res)=>{
    //res.send('Hello world');
    res.json({"title":"Hello Products"})   
})

router.get('/test', (req,res)=>{
   const data = {
       "dato 1":"hola que tal",
       "dato 2":"este es test de productos"
   }
    res.json(data)
})

router.get('/products', (req,res)=>{
    res.json(products)
    //console.log(req.headers);   //Podemos ver todos los headers impresos por consola 
    //console.log(typeof products) 
})

router.post('/products', (req,res)=>{
    const prod = req.body
    //console.log(req.headers); //Podemos ver todos los headers impresos por consola
    console.log(prod) // Enviamos un JSON pero recibimos en el req.body el objeto asociado
    //res.json(prod)
    if(!prod){
        return res.status(400).json({error: "error en product"});
    }
    const numIds = products.map((product)=> product.id) //devolemos array de ids
    const maxId = Math.max(...numIds)   //En caso de estar desordenados , pillamos el maximo id
    const {name, image, price, desc} = prod

    const newProduct = {
        id:maxId+1,
        name: name,
        image: image,
        price:price,
        desc: desc
    }
    products =[...products, newProduct] 
    //products = products.concat(newProduct) idem arriba
    console.log(products)
    res.status(201).json(products)
   
})

module.exports = router;