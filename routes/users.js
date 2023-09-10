const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load User model
const User = require('../model/User');

// Load Input Validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

// @route POST users/register
// @description user registration
// @access Public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

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

// @route POST users/login
// @description user registration
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation
    if (!isValid) {
        return res.status(400).json(errors);
    } else {
        const email = req.body.email;
        const pass = req.body.password;

        User.findOne({ email: email }).then((user) => {
            if(!user) {
                errors.email = "User not found!";
                return res.status(400).json(errors);
            }

            bcrypt.compare(pass, user.password, (err, isMatch) => {
                if(isMatch) {
                    const payload = {
                        id: user._id,
                        name: user.name,
                        email: user.email
                    }

                    jwt.sign(payload, process.env.secretOrKey, { expiresIn: '60m' }, (err, token) => {
                        token = 'Bearer ' + token;
                        res.status(200).json(token);
                    });
                } else {
                    errors.password = 'Incorrect Password';
                    res.status(400).json(errors);
                }
            });
        });
    }
});

router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.status(200).json("authentication works!");
});

module.exports = router;
