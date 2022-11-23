const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    }
},
{
    timestamps: true,
    versionKey: false
});

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

categorySchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('categories', categorySchema);