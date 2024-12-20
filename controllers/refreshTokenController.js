const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    console.log('Cookies received:', cookies); // Log received cookies
    if (!cookies?.refreshToken) return res.status(401).json({ message: 'Refresh token missing' });

    const refreshToken = cookies.refreshToken;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || foundUser.username !== decoded.username) {
            return res.status(403).json({ message: 'Forbidden: Invalid refresh token' });
        }

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": decoded.username,
                    "idData": foundUser._id.toString()
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '20m' }
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,  // set this true when you push to production, setting false for now to test with localhost
            sameSite: 'None',
            maxAge:20 * 60 * 1000 // 20 minutes
        });

        res.status(200).json({ message: 'Access token refreshed successfully' });
    });
};

module.exports = { handleRefreshToken };
