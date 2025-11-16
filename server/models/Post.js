const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true },
        category: { type: [String], enum: ["work", "blog"], required: true },
        title: { type: String, required: true },
        summary: { type: String, required: true },
        date: { type: Date, required: true },
        content: { type: String, required: true },
        published: { type: Boolean, default: true }
    },
    { timestamps: true }
);
module.exports = mongoose.model('Post', postSchema);