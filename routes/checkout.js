const express = require('express')
const router = express.Router();

const checkoutService = require('../services/checkout');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT')

router.post('/', AuthenticateWithJWT, async (req,res)=>{
    try {
        const session = await checkoutService.checkout(req.userId);
        res.json(session);
    } catch (e) {
        console.log(e)
        res.status(500).json({
            'message': e.message
        })
    }
})

module.exports = router;