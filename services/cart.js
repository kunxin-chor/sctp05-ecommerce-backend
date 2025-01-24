const productData = require('../data/cart');

async function getCartContents(userId) {
    return await productData.getCartContents(userId);
}

async function updateCart(userId, cartContents) {
    // 1. check if there is enough stock
    // 2. check if there are price changes
    await productData.updateCart(userId, cartContents);
}

module.exports = {
    getCartContents, updateCart
}