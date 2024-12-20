/*

### Why the Previous Approach Failed:
- **Refresh Token Cookie Not Sent:** Even though the access token worked, the refresh token’s cookie wasn’t being sent to the `/refresh` route, likely due to path or `SameSite` restrictions.
- **Cross-Route Miscommunication:** The `/refresh` route relied on the client’s browser sending the correct cookies, which didn’t happen consistently. 
- 301 redirects permanently while 302 redirects temporarily
- whtat 301 does is, it will make browser store in cache, so when u access that route again, it won't even touch that route, just accesses the redirected route again
---

### Lesson Learned:
- Keeping logic self-contained (like handling both tokens in the same middleware) reduces complexity and eliminates potential client/browser issues.
*/

const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
    console.log('Cookies recieved are ',req.cookies);
    const accessToken = req.cookies?.accessToken; // Get access token from cookies
    const refreshToken = req.cookies?.refreshToken; // Get refresh token from cookies

    if (!accessToken && !refreshToken) {
        console.log("I am the real one bruv");
        return res.redirect(302, '/regauth'); // Redirect to login if both tokens are missing
    }

    // Verify Access Token
    if (accessToken) {
        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded.UserInfo.username; // Attach user info to the request
            req.params.idi = decoded.UserInfo.idData; 
            return next(); // Access token is valid, proceed
        } catch (err) {
            console.log('Access token expired or invalid:', err.message);
            // Access token failed, attempt refresh
        }
    }

    // Refresh Token Logic
    if (refreshToken) {
        try {
            // Verify the refresh token
            const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

            // Generate a new Access Token
            const newAccessToken = jwt.sign(
                { "UserInfo": { 
                    "username": decodedRefresh.username, 
                    "idData": decodedRefresh.idData 
                    } 
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '20m' } // 20 minute expiration
            );

            // Set the new Access Token in the response cookie
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true, // Change to true in production
                sameSite: 'None', // Adjust as needed
                maxAge: 20 * 60 * 1000, // 20 minute
                path: '/' // Ensure the cookie is accessible site-wide
            });

            // Attach user info to the request
            req.user = decodedRefresh.username;
            req.params.idi = decodedRefresh.idData;
            return next(); // Proceed after refreshing access token
        } catch (err) {
            console.error('Refresh token expired or invalid:', err.message);
            // Clear cookies
            res.clearCookie('accessToken', { httpOnly: true });
            res.clearCookie('refreshToken', { httpOnly: true });
            return res.redirect(302, '/regauth'); // Redirect if refresh token fails
        }
    }

    res.sendStatus(403); // Forbidden if all checks fail
};

module.exports = verifyJWT;
