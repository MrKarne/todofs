const User = require('../model/User');

const handleLoad = async (req, res) => {
    if (!req.user) return res.status(400).json({ "message": 'Username required' });
        const user = await User.findOne({ username: req.user }).exec();
        
        if (!user) {
            return res.status(204).json({ 'message': `User ${req.user} not found` });
        }
        res.json(user.tododata);
}

module.exports = {
    handleLoad
}