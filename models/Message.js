const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    room: { type: String, required: true }, // Add room field
}, { timestamps: true });
module.exports = mongoose.model('Message', messageSchema);
