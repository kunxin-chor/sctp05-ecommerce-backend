const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Parameters
// orderId: Need to know the order that the user is checking out for
// orderItems: [ {product_id, quantity, price, productName, imageUrl }]
// userId: the id of the user checking out
async function createCheckoutSession(userId, orderItems, orderId) {
    // 1. line items 
    // Stripe: one line item is one line in the invoice
    const lineItems = createLineItems(orderItems);
    console.log("lineItems =>", lineItems)

    // 2. use the line items to create a check out session
    const session = await stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items: lineItems,
        mode: 'payment',
        // Stripe will redirect the user to those pages
        // depending if the payment is successful or not
        success_url:"https://www.google.com",
        cancel_url:"https://www.yahoo.com",
        metadata:{
            userId: userId,
            orderId: orderId
        }
    })
    return session;


}

function createLineItems(orderItems) {
    const lineItems = [];
    for (let o of orderItems) {
        // the key/value pairs of a Stripe line item is fixed by
        // Stripe
        const newLineItem = {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: o.productName,
                    // images must be an array and cannot be null
                    images: [o.imageUrl || 'https://via.placeholder.com/150'],
                    metadata: {
                        product_id: o.product_id
                    }
                },
                // save the amount as cents
                unit_amount: Math.round(o.price * 100)

            },
            quantity: o.quantity
        }
        lineItems.push(newLineItem);
    }
    return lineItems;
}

module.exports = {
    createCheckoutSession
}