// import modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({path: '../.env'});
// Google auth
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require("cookie-parser");

// app
const app = express();

// mongodb
mongoose
    .connect(process.env.MONGO_URI, {})
    .then((connection) => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// middleware
app.use(morgan("dev"));
app.use(cors({origin: true, credentials: true}));
app.use(cookieParser());

// Google auth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Pass the profile information to the next middleware
    return done(null, profile);
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
app.use(passport.initialize());
app.use('/', authRoutes);
app.use('/api/user', userRoutes);

// routes
const testRouter = require('./routes/test');
const nationalParkRouter = require('./routes/nationalParkRoutes');
app.use('/api', testRouter);
app.use('/api/parks', nationalParkRouter);

// port
const port = process.env.SERVER_PORT || 3001;

// listener
const server = app.listen(port, () => console.log(`Server is running on ${port}`));
console.log(`Current VERCEL_ENV is ${process.env.VERCEL_ENV}`);