const express = require('express');
const router = express.Router();

router.get("/", (req,res)=>{
    res.json({
        'message': 'Get all products'
    })
})

router.get('/:id', (req,res)=>{
    res.json({
        'message':`Getting product with id ${req.params.id}`
    })
})


module.exports = router;