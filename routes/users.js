const express = require('express');
const router = express.Router();
const userService = require('../services/users');
const jwt = require('jsonwebtoken');
const AuthenticateWithJWT = require('../middlewares/AuthenticateWithJWT');

router.post('/register', async (req, res) => {
    try {
        // Register user with the new payload structure
        const userId = await userService.registerUser(req.body);

        res.status(201).json({ message: "User registered successfully", userId });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        if (user) {

            // create the JWT token
            const token = jwt.sign({
                userId: user.id
            }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({
                'message': 'Logged in successful',
                token
            })

        } else {
            throw new Error("Unable to get user");
        }
    } catch (e) {
        console.log(e);
        res.status(400).json({
            'message': 'Unable to log in',
            'error': e.m
        })
    }
})

// get the details of the current logged-in user from a JWT
router.get('/me', AuthenticateWithJWT, async (req, res) => {
    try {
        const user = await userService.getUserDetailsById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User is not found"
            })
        }

        const {password, ...userWithOutPassword} = user;

        res.json({
            'user': userWithOutPassword
        });


    } catch (e) {
        res.status(500).json({
            message: e.message
        })
    }

})

// update the details of the current logged-in user
router.put('/me', AuthenticateWithJWT, async (req, res) => {
    try {
        console.log(req.body);
        // todo: validate if all the keys in req.body exists
        if (!req.body.name || !req.body.email || !req.body.salutation || !req.body.marketingPreferences || !req.body.country) {
            return res.status(401).json({
                'error':'Invalid payload or missing keys'
            })
        }
        const userId = req.userId;
        await userService.updateUserDetails(userId, req.body);
        res.json({
            'message':'User details updated'
        })
        

    } catch (e) {   
        console.log(e);
        res.status(500).json({
            'message':'Internal server error'
        })

    } 
})

// delete the current user
router.delete('/me', AuthenticateWithJWT, async (req, res) => {
   try {
     await userService.deleteUserAccount(req.userId);
     res.json({
        'message': "User account deleted"
     })
   } catch (e) {
     console.log(e);
     res.status(500).json({
        'message':'Internal Server Error'
     })
   }
})

module.exports = router;