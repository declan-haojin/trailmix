// import modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });


// app
const app = express();

// mongodb
mongoose
    .connect(process.env.MONGO_URI, {})
    .then((connection) => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// middleware
app.use(morgan("dev"));
app.use(cors({ origin: true, credentials: true }));

// routes
const testRouter = require('./routes/test');
app.use('/', testRouter);

// port
const port = process.env.SERVER_PORT || 3001;

// listener
const server = app.listen(port, () => console.log(`Server is running on ${port}`));