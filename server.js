// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
  try {
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error(error);
  }
});

// GET /api/products/:id - Get a specific product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error(error);
  }
});

// POST /api/products - Create a new product
app.post('/api/products', (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };
    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
    console.error(error);
  }
});

// PUT /api/products/:id - Update a product
app.put('/api/products/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const updatedProduct = {
      id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock
    };
    products[productIndex] = updatedProduct;
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error(error);
  }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    products.splice(productIndex, 1);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error(error);
  }
});

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
app.use((req, res, next) => {
  const time = new Date().toISOString();
  console.log(`[${time}] ${req.method} ${req.url}`);
  next();
});

// - Authentication
app.use((req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // TODO: Verify token (e.g., using JWT)
  next();
});

// - Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

// Filter products by category
app.get('/api/products/category/:category', (req, res) => {
  try {
    const category = req.params.category;
    const filteredProducts = products.filter(p => p.category === category);
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error(error);
  }
});

// Pagination for products listing
app.get('/api/products/page/:page/limit/:limit', (req, res) => {
  try {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = products.slice(startIndex, endIndex);
    res.json(paginatedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error(error);
  }
});

// search products by name
app.get('/api/products/search/:name', (req, res) => {
  try {
    const name = req.params.name.toLowerCase();
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(name));
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error(error);
  }
});


// route for getting products statistics
app.get('/api/products/stats', (req, res) => {
  try {
    const totalProducts = products.length;
    const categories = [...new Set(products.map(p => p.category))];
    const inStockCount = products.filter(p => p.inStock).length;

    const stats = {
      totalProducts,
      categories,
      inStockCount
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
    console.error(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 