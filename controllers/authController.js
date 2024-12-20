const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ message: 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized: User not found' });

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "idData": foundUser._id.toString() 
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20m' } // Set to 1 minute for testing purposes, change as needed
        );
        const refreshToken = jwt.sign(
            {
                "username": foundUser.username,
                "idData": foundUser._id.toString()
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } // 1 day expiry for refresh token
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        res.cookie('refreshToken', refreshToken, {
            path: '/', // Ensure it's available on all routes
            httpOnly: true,
            secure: true,  // set this true when you push to production, setting false for now to test with localhost
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true, // set this true when you push to production, setting false for now to test with localhost
            sameSite: 'None',
            maxAge: 20 * 60 * 1000 // 20 minutes
        });
        // console.log('Cookies set:', res.getHeaders()['set-cookie']); // debug thing
        res.status(201).json({ message: 'Logged in successfully' });
    } else {
        res.status(401).json({ message: 'Unauthorized: Incorrect password' });
    }
};

module.exports = { handleLogin };
