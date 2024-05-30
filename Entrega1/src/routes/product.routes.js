
import fs from "fs";
import {Router} from "express";
import { error } from "console";

const router = Router();
const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'));

//Ruta de Todos los productos
router.get("/", (req, res) => {
  res.json(products);
})

//Ruta de GET/:pid lista los productos segun id
router.get("/:pid", async(req, res) => {
  const product = await products.find(product => product.id === req.params.id)

  if (!products) {
    res.status(404).json({
      error: 'This product id was not found'
    }) } else {
      res.json(product);
    }
})

//Ruta de POST agrega un nuevo producto a BD
router.post("/",(req, res) => {
  const {imagen, marca, tipo, descripcion, precio} = req.body;
  const newId= products.length > 0 ? products[products.length - 1].id + 1 : 1;

  if (!imagen || !marca || !tipo || !descripcion || !precio) {
    res.status(400).json({ error:'every field is required' })
  } else {
    const newProduct = {
      id: newId,
      status: true,
      imagen,
      marca,
      tipo,
      descripcion,
      precio
    };
    products.push(newProduct);
    fs.writeFileSync('./data/products.json', JSON.stringify(products, null, '\t'));
    res.json(products);
  }
})

// PUT /:pid -> Actualiza un producto existente con lo que enviamos de body (nunca va a cambiar el id o eliminarlo)
router.put("/:pid", (req, res) => {
  const{pid} = req.params
  const { imagen, marca, tipo, descripcion, precio } = req.body;

  if (!imagen || !marca || !tipo || !descripcion || !precio) {
    res.status(400).json({ error:'every field is required' })
  } else {
    const product = products.find(product => product.id === pid);
    if (!product) {
      res.status(404).json({ error:'Product not found with the id required' })
    } else {
      product.imagen = imagen;
      product.marca = marca;
      product.tipo = tipo;
      product.descripcion = descripcion;
      product.precio = precio;
      fs.writeFileSync('./data/products.json', JSON.stringify(products, null, '\t'));
      res.json(products);
    }
  }
})

//DELETE /:pid -> Elimina un producto existente dado un id.

router.delete("/:pid", (req, res) => {
  const {pid} = req.params
  const productIndex = products.findIndex(product => product.id === pid);

  if (pid > products[products.length-1].id) {
    res.status(400).json({ error:'Product not found with the id ${pid} required' })
}else{
  try{
    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct);
  } catch(error){
    res.status(400).json(`An error occurred while processing the request: ${error}`);
  }
}
})
export default router