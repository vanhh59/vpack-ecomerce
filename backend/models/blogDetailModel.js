import mongoose from "mongoose";

// Assuming you already have the Blog model imported
const blogDetailSchema = new mongoose.Schema({
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",  // Reference to the Blog schema
        required: true,
    },
    title: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
}, { timestamps: true });

// Exporting the BlogDetail model
export default mongoose.model("BlogDetail", blogDetailSchema);
