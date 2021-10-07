const express = require('express');
const app = express();
const userRouter = require('./routers/User.js');

app.use(express.json())
app.use(userRouter);

module.exports = app;