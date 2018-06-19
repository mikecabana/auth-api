const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    label: { type: String, required: true },
    site: { type: String, required: true },
    location: { type: String, required: true },
    date: Date,
    employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }]
});

module.exports = mongoose.model('EventModel', eventSchema);