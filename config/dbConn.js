const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        // await mongoose.connect(process.env.DATABASE_URI, {
        //     // useUnifiedTopology: true,
        //     // useNewUrlParser: true // no longer needed as for new node js verison and mongodb will manage
        // });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB