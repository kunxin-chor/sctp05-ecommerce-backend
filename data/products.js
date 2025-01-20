const pool = require('../database');

async function getAllProducts() {
    const [products] = await pool.query(`SELECT id, name, CAST(price as DOUBLE) AS price, image FROM products`);
    return products;
}

async function getProductById(productId) {
    const [products] = await pool.query(`SELECT * FROM products WHERE id=?`, [productId]);
    return products[0];
}

module.exports = {
    getAllProducts, getProductById
}