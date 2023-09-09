const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const user = require('./routes/users');

dotenv.config({ path: './config/.env' });

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
