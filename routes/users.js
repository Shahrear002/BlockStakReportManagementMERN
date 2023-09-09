const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load User model
const User = require('../model/User');

// Load Input Validation
const validateRegisterInput = require('../validation/register');

// @route POST users/register
// @description user registration
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    console.log(req.body);
    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    } else {
        User.findOne({ email: req.body.email }).then((user) => {
            if (user) {
                errors.email = 'User with this email already exists!';
                res.status(400).json(errors);
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    role: req.body.role,
                    password: req.body.password,
                    phoneNumber: req.body.phoneNumber,
                    address: req.body.address,
                    profession: req.body.profession,
                    favoriteColors: req.body.favoriteColors,
                });

                // Hash password before saving in database
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if (error) throw error;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then((user) =>
                                res
                                    .status(200)
                                    .json('User registered successfully!')
                            )
                            .catch((error) => console.log(error));
                    });
                });
            }
        });
    }
});

module.exports = router;
