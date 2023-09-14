const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const user = require('./routes/users');
const report = require('./routes/reports');

dotenv.config({ path: './config/.env' });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());
require('./config/passport')(passport);

mongoose
    .connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log('MongoDB connected successfully!');
    })
    .catch((error) => {
        console.log(error);
    });

app.use('/users', user);
app.use('/reports', report);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
