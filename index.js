const express = require('express');
require('dotenv').config();
const product = require('./src/product/product');
const port  = 3200;
const app = express(); 

app.use(express.json());
app.use('/product', product)
app.listen(port, ()=> {
    console.clear()
    console.log(`Server is running on port ${port}`)
})

