const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    reportName: {
        type: String,
        required: true,
        max: 100,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
    },
    profession: {
        type: String,
    },
    address: {
        type: String,
    },
    favoriteColors: [
        {
            colorName: {
                type: String,
            },
        },
    ],
});

module.exports = mongoose.model('Report', ReportSchema);
