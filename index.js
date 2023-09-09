const express = require('express');
const dotenv = require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
