require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
// const verifyAccessTokenOrRefresh = require('./middleware/checkToken')

const PORT = process.env.PORT || 8080;

//Connect to MongoDB, cuz it if this fails,, nothing else is needed as there is no data, so placing it in the first
connectDB();

// custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json 
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/regauth', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/save', verifyJWT, require('./routes/save'))
app.use('/load', verifyJWT, require('./routes/loadData'))




// app.use(verifyJWT);
// If you don't want a route to verify JWT, you should put it above this line 
//And if you want it to verify the token before giving the access to the route, you should put it below this line. As express works like a waterfall

// You don't want it to check JWT for register and auth obviously

// app.use('/users', require('./routes/api/users'));
// app.use('/index(.html)?', verifyJWT, require('./routes/index'));
app.use('^/$|/index(.html)?', verifyJWT, require('./routes/index'));


app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);


mongoose.connection.once('open', ()=>{
    // console.log('Connected to MongoDB')
    // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    app.listen(PORT);
})


// In command line:
// node -> opens command line and then there is common core module called repl.
// cmd: require('crypto').randomBytes(64).toString('hex')
// thi sabove thing gives us the token inside string but remove th equotes as you won't be using quotes inside the .env file

// Can read about jsonwebtoken package in npm's documentation
