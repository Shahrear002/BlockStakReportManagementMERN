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
                return res.status(400).json(errors);
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
// @description user login
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
            if (!user) {
                errors.email = 'User not found!';
                return res.status(400).json(errors);
            }

            bcrypt.compare(pass, user.password, (err, isMatch) => {
                if (isMatch) {
                    const payload = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };

                    jwt.sign(
                        payload,
                        process.env.secretOrKey,
                        { expiresIn: '1h' },
                        (err, token) => {
                            token = token;
                            return res
                                .cookie('accessToken', token, {
                                    maxAge: 3600000,
                                    httpOnly: true,
                                })
                                .status(200)
                                .json('Log in successfull');
                            // res.status(200).json(token);
                        }
                    );
                } else {
                    errors.password = 'Incorrect Password';
                    return res.status(400).json(errors);
                }
            });
        });
    }
});

// @route POST users/logout
// @description user logout
// @access Private
router.get(
    '/logout',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        return res
            .clearCookie('accessToken')
            .status(200)
            .json('Successfully logged out!');
    }
);

// @route POST users/test
// @description testing route
// @access Private
router.post('/refreshToken', (req, res) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(400).json('Access token not found!');
    }

    jwt.verify(accessToken, process.env.secretOrKey, (err, decoded) => {
        if (err) {
            const isActive = req.body.isActive;

            if (isActive) {
                const payload = {
                    id: req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    role: req.user.role,
                };

                const refreshToken = jwt.sign(
                    payload,
                    process.env.secretOrKey,
                    {
                        expiresIn: '1h',
                    }
                );

                return res
                    .cookie('refreshToken', refreshToken, {
                        maxAge: 3600000,
                        httpOnly: true,
                    })
                    .status(200)
                    .json('Refresh token generated successfully!');
            }
        } else {
            return res.status(400).json('Access token is valid!');
        }
    });
});

module.exports = router;
