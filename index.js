const express = require('express');
const cors = require('cors');
require('dotenv').config();

// require in the database pool
// (do after the dotenv has been configured)
const pool = require('./database');

const app = express();

// import the routers
const productRouter = require('./routes/products');
const userRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const checkoutRouter = require('./routes/checkout');
const stripeRouter = require('./routes/stripe');

// initalize mdidleware
app.use(cors());

// test route
app.get('/', async (req,res)=>{

    const [products] = await pool.query("SELECT * FROM products");

    res.json({
        message: "Welcome to the API",
        products
    })
});

// If the URL begins with `/products`, the remaining
// of the URL will go to the productRouter
app.use('/api/products', express.json(), productRouter);
app.use('/api/users',  express.json(), userRouter);
app.use('/api/cart', express.json(), cartRouter);
app.use('/api/checkout', express.json(), checkoutRouter);
app.use('/stripe', stripeRouter);


const PORT = process.env.PORT || 3000; // <-- for deployment later, because cloud hosting services may need us to set a port
app.listen(PORT,()=>{
    console.log(`Server started at PORT: ${PORT}`)
})
