import mongoose from "mongoose";

const ratingSchema = mongoose.Schema(
  {
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    ratingValue: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;