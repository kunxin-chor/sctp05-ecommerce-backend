const cartService = require('../services/cart');
const orderService = require('../services/order');
const stripeService = require('../services/stripe');

async function checkout(userId) {
    // 1. get the content of the user's shopping cart
    const cartItems = await cartService.getCartContents(userId);
    
    // 2. create an order and order_items to the user's shopping cart
    const orderId = await orderService.createOrder(userId, cartItems);

    // 3. create the checkout session
    const session = await stripeService.createCheckoutSession(userId, cartItems, orderId);

    // 4. update the order with the check out session id
    await orderService.updateOrderSessionId(orderId, session.id);

    return session;

}

module.exports = {
    checkout
}