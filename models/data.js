const mongoose = require('mongoose')
const { Schema } = mongoose

const dataSchema = new Schema({
    token: {type: String, required: true},
    token_type: {type: String, required: true},
    expires: {type: Number, required: true}
})

module.exports = mongoose.model('spotify', dataSchema)