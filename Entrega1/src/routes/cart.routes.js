import { Router } from "express";
import fs from "fs"

const router = Router();
const cartsFilePath = './data/carts.json';
const productsFilePath = './data/products.json';

const carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

// Ruta POST / crea un nuevo carrito
router.post('/', (req, res) => {
    const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
  
    const newCart = {
      id: newId,
      products: []
    };
  
    carts.push(newCart);
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
  
    res.status(201).json(newCart);
  });

// Ruta GET /:cid lista los productos del carrito con el id proporcionado
router.get('/:cid', (req, res) => {
    const cart = carts.find(cart => cart.id === parseInt(req.params.cid));
  
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
  
    res.json(cart.products);
  });
  
// Ruta POST /:cid/product/:pid agrega un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
    const cart = carts.find(cart => cart.id === parseInt(req.params.cid));
    const product = products.find(product => product.id === parseInt(req.params.pid));
  
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
  
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
  
    const existingProduct = cart.products.find(p => p.product === product.id);
  
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: product.id, quantity: 1 });
    }
  
    fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
  
    res.status(201).json(cart);
  });

export default router;
