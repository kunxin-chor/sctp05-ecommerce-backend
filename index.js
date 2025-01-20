const express = require('express');
const cors = require('cors');
require('dotenv').config();

// require in the database pool
// (do after the dotenv has been configured)
const pool = require('./database');

const app = express();

// import the routers
const productRouter = require('./routes/products');
const userRouter = require('./routes/users')

// initalize mdidleware
app.use(express.json());
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
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

const PORT = process.env.PORT || 3000; // <-- for deployment later, because cloud hosting services may need us to set a port
app.listen(PORT,()=>{
    console.log(`Server started at PORT: ${PORT}`)
})
