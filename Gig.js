import mongoose from "mongoose";

const gigSchema = new mongoose.Schema({
    title: String,
    description: String,
    budget: Number,
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: { type: String, default: 'open' },

}, {
    timestamps: true
})

export default mongoose.model("Gig", gigSchema)