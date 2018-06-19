const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    description: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: Number, required: true },
    mimetype: { type: String, required: false },
    container: { type: String, required: false },
    isActive: { type: Boolean, default: false },
    uploadDate: Date,
});

module.exports = mongoose.model('DocumentModel', documentSchema);