const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

//Load User model
const Report = require('../model/Report');

// Load Input Validation
const validateReportInput = require('../validation/report');

// @route POST reports/viewReports
// @description view report
// @access Private
router.get('/viewReport', passport.authenticate('jwt', { session: false }), (req, res) => {
    Report.find().then((reports) => {
        if(reports.length == 0) {
            res.status(400).json('No report found!');
        }

        res.status(200).json(reports);
    });
});

// @route POST reports/addReport
// @description add report
// @access Private
router.post('/addReport', passport.authenticate('jwt', { session: false }), (req, res) => {
    if(req.user.role === 'admin') {
        const { errors, isValid } = validateReportInput(req.body);

        if(!isValid) {
            res.status(400).json(errors);
        } else {
            const newReport = new Report({
                reportName: req.body.reportName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                profession: req.body.profession,
                address: req.body.address,
                favoriteColors: req.body.favoriteColors
            });

            newReport.save().then((report) => {
                res.status(200).json('Report added successfully.');
            }).catch((error) => {
                console.log(error);
                res.status(400).json('Report add failed!');
            })
        }
    } else {
        res.status(405).json('You are not allowed to add report');
    }
});

module.exports = router;