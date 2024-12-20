const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// We automatically have an object id created so no need to do that here
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tododata: {
        type: Object,
        required: true,
        default: {
            "tododata": `
            <div class="head flex">
        <div class="header">Todo list app</div>
        <div class="flex headright">
            <div class="newtask" onclick="saveboy()">Save</div>
            <div class="newtask" onclick="newtaskr()">NEW TASK</div>
            <div class="newtask" onclick="logout()">Logout</div>
        </div>
    </div>
    <hr>
    <div class="tada tada1">
        <div class="task flex">
            <input type="checkbox" name="Hello world" class="he"><textarea type="text" rows="1" class="tasktext">Click here</textarea>
        </div>
        <div class="dele flex" onclick="deleter('1')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
                <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
            </svg>
        </div>
    </div>
            `
        }
    },
    refreshToken: String
});

module.exports = mongoose.model('User', userSchema);
// it will by default set this to lowercase and plural so it willl look for employees collection in the database