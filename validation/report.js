const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateReportInput(data) {
    let errors = {};

    data.reportName = !isEmpty(data.reportName) ? data.reportName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : '';

    if (!Validator.isLength(data.reportName, { min: 5, max: 50 })) {
        errors.reportName = 'Name must be between 5 and 100 characters';
    }

    if (Validator.isEmpty(data.reportName)) {
        errors.reportName = 'Name field is required';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.phoneNumber)) {
        errors.phoneNumber = 'Mobile Number is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
