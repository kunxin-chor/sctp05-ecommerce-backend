const productDataLayer = require('../data/products');

async function getAllProducts(){
    return await productDataLayer.getAllProducts();
}

async function getProductById(productId) {
    return await productDataLayer.getProductById(productId);
}

module.exports = {
    getAllProducts, getProductById
}