import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

// const reviewSchema = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     rating: {
//       type: Number,
//       required: true,
//       min: 1, // Minimum rating
//       max: 5  // Maximum rating
//     },
//     comment: { type: String, required: true },
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: ObjectId, ref: "Category", required: true },
    description: { type: String, required: true },
    reviews: {type: String},
    rating: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      max: 5
    },
    numReviews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

// Optionally create indexes for faster querying
productSchema.index({ name: 1, brand: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
