const express = require('express');
const router = express.Router();
const cartService = require('../services/cart');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT');

// GET: get the entire content of the shopping cart
router.get('/', AuthenticateWithJWT, async (req, res)=>{
    try {
        const cartContent = await cartService.getCartContents(req.userId);
        res.json(cartContent);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Error retriving cart"
        })
    }
})

// PUT: Update the server-side shopping cart with the one from the client-side
router.put('/',  AuthenticateWithJWT,  async (req,res)=>{
    try {
        await cartService.updateCart(req.userId, req.body.cartItems);
        res.json({
            'message':'Shopping is updated'
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({
            'message':'Error updating shopping cart'
        })
    }

});

module.exports = router;