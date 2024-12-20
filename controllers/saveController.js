//handleSave function should be exported

const User = require('../model/User');

const handleSave = async (req, res) => {
    if (!req.user) return res.status(400).json({ "message": 'Username required' });
    const user = await User.findOne({ username: req.user }).exec();
    
    if (!user) {
        return res.status(204).json({ 'message': `User ${req.user} not found` });
    }
    user.tododata = req.body;
    await user.save();
    res.json("brocode successful")
}

module.exports = { handleSave }