const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    username: String,
    password: String,
    createTime: Number
})
let userModel = mongoose.model('user', userSchema);
module.exports = userModel;