const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    // Whenever you use a method u r not sure about in async await, better use .exec();

    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user. This one doesn't need '.save()' thing.
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        }); // Didn't put the roles here cuz we put it in default already in the User.js
        
        // another way
        // const newUser = await User.create({
        //     "username": user,
        //     "password": hashedPwd
        // });
        // const result = await newUser.save();

        // console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };