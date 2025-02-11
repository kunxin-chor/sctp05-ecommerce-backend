const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const router = express.Router();
const orderServices = require('../services/order');

// we have to use express.raw because express.json will
// cause the stripe's data to be malformed
router.post('/webhook', 
    express.raw({type:'application/json'}),
    async function (req,res) {
        let event = null;
        try {
            // the signature contains information whether
            // the request really comes from the Stripe (it's like the
            // payload the JWT)
            const sig = req.headers['stripe-signature'];
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
            console.log(event.data.object.metadata);
            if (event.type == 'checkout.session.completed') {
                const session = event.data.object;
                if (session.metadata && session.metadata.orderId) {
                    await orderServices.updateOrderStatus(session.metadata.orderId, 'processing');
                }
            }
            return res.sendStatus(200);


        } catch (e) {
            console.error("Webhook error:", e.message);
            return res.status(400).send(e.message);
        }

    }
)

module.exports = router;