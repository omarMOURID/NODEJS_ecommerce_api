const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
// for reading env variables
require('dotenv').config();


// differents routers
const authRouter = require('./auth/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const categorieRouter = require('./routes/categorieRoutes');

// start our application
const app = express();


// set middlewares
//to enable logging
app.use(cors());
app.use(morgan('dev'));
//to add req body
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
//to enable static the access to the statics files in uploads
app.use('/uploads', express.static(process.env.STATIC_FILES));


//set our routers
app.use('/', authRouter);
app.use('/products', productRouter);
app.use('/categories', categorieRouter);
app.use('/users', userRouter);


// error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(err.message);
});


// create mongodb connection and start listening at the port
mongoose.connect(process.env.MONGODB_URI)
    .then((result) => {
        app.listen(process.env.PORT || 3000,  () => {
            console.log('listening on the port :'+(process.env.PORT || 3000));
        });
    }).catch((err) => {
        console.log(err);
        process.exit(1);
    });



