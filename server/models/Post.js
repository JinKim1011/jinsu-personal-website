import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true },
        category: { type: [String], enum: ["work", "blog"], required: true },
        title: { type: String, required: true },
        summary: { type: String, required: true },
        date: { type: Date, required: true },
        content: { type: String, required: true },
        published: { type: Boolean, default: false }
    },
    { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);