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
router.get(
    '/viewReport',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        Report.find().then((reports) => {
            if (reports.length == 0) {
                return res.status(400).json('No report found!');
            }

            return res.status(200).json(reports);
        });
    }
);

// @route POST reports/addReport
// @description add report
// @access Private
router.post(
    '/addReport',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (req.user.role === 'admin') {
            const { errors, isValid } = validateReportInput(req.body);

            if (!isValid) {
                return res.status(400).json(errors);
            } else {
                const newReport = new Report({
                    reportName: req.body.reportName,
                    email: req.body.email,
                    phoneNumber: req.body.phoneNumber,
                    profession: req.body.profession,
                    address: req.body.address,
                    favoriteColors: req.body.favoriteColors,
                });

                newReport
                    .save()
                    .then((report) => {
                        res.status(200).json('Report added successfully.');
                    })
                    .catch((error) => {
                        console.log(error);
                        return res.status(400).json('Report add failed!');
                    });
            }
        } else {
            return res.status(405).json('You are not allowed to add report');
        }
    }
);

// @route POST reports/deleteReport
// @description delete report
// @access Private
router.delete(
    '/deleteReport/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (req.user.role === 'admin') {
            Report.findByIdAndDelete(req.params.id)
                .then((report) => {
                    if (!report) {
                        return res.status(400).json('Report not found!');
                    }

                    res.status(200).json('Report deleted successfully.');
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(400).json('Report delete failed!');
                });
        } else {
            return res.status(405).json('You are not allowed to delete report');
        }
    }
);

// @route POST reports/editReport
// @description edit report
// @access Private
router.post(
    '/editReport/:id',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        if (req.user.role === 'admin') {
            if (Object.keys(req.body).length === 0) {
                return res.status(400).json('Required fields can not null!');
            }

            const update = {};
            for (const key of Object.keys(req.body)) {
                if (req.body[key] !== '') {
                    update[key] = req.body[key];
                }
            }

            const filter = { _id: req.params.id };

            Report.findOneAndUpdate(filter, { $set: update }, { new: true })
                .then((report) => {
                    if (!report) {
                        return res.status(400).json('Report not found!');
                    }

                    res.status(200).json('Report updated successfully.');
                })
                .catch((error) => {
                    console.log(error);
                    res.status(400).json('Report update failed!');
                });
        } else {
            return res.status(405).json('You are not allowed to edit report');
        }
    }
);

module.exports = router;
