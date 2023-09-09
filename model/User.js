const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    phoneNumber: {
        type: String,
        required: true,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('User', UserSchema);
