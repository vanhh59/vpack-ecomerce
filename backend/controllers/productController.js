import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

const addProduct = asyncHandler(async (req, res) => {
  try {
    // Accessing data from req.body
    const { name, description, price, category, quantity, brand, image, image2 } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!brand) {
      return res.status(400).json({ error: "Brand is required" });
    }
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    if (price === undefined) { // Check for undefined, since price can be 0
      return res.status(400).json({ error: "Price is required" });
    }
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (quantity === undefined) { // Check for undefined, since quantity can be 0
      return res.status(400).json({ error: "Quantity is required" });
    }
    if (!image) { // Validate that image is provided
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Check if the category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: "Invalid category. Category does not exist." });
    }

    // Create and save the new product
    const product = new Product({
      name,
      description,
      price,
      category,
      quantity,
      brand,
      image, // Include the image field
      image2: image, // Include the image2 field
      countInStock: quantity // Assuming countInStock is initialized with quantity
    });

    await product.save();

    // Respond with the created product
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand, image, image2 } = req.body;

    // Validation for mandatory fields if they are included in the update
    if (name !== undefined && !name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (brand !== undefined && !brand) {
      return res.status(400).json({ error: "Brand is required" });
    }
    if (description !== undefined && !description) {
      return res.status(400).json({ error: "Description is required" });
    }
    if (price !== undefined && price === null) { // Ensure price isn't null if provided
      return res.status(400).json({ error: "Price is required" });
    }
    if (category !== undefined && !category) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (quantity !== undefined && quantity === null) { // Ensure quantity isn't null if provided
      return res.status(400).json({ error: "Quantity is required" });
    }
    if (image !== undefined && !image) {
      return res.status(400).json({ error: "Image URL is required" });
    }
    if (image2 !== undefined && !image2) {
      return res.status(400).json({ error: "Secondary image URL is required" });
    }

    // Check if the category exists if it’s included in the update
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ error: "Invalid category. Category does not exist." });
      }
    }

    // Build update object with only the fields provided in req.body
    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = price;
    if (category !== undefined) updateFields.category = category;
    if (quantity !== undefined) updateFields.quantity = quantity;
    if (brand !== undefined) updateFields.brand = brand;
    if (image !== undefined) updateFields.image = image;
    if (image2 !== undefined) updateFields.image2 = image2;

    // Update the product
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true } // Return updated document, validate fields
    );

    // Check if the product was found
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Respond with the updated product
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    // Extract keyword and category from query parameters
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword.trim(),
            $options: "i",
          },
        }
      : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};

    // Combine filters
    const filters = { ...keyword, ...categoryFilter };

    const products = await Product.find(filters).populate({
      path: "category",
      select: "name",
    });

    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      category: product.category.name,
    }));

    res.json({
      products: formattedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: 'category',
        select: 'name',
      })
      .limit(12)
      .sort({ createdAt: -1 });

    const formattedProducts = products.map(product => ({
      ...product.toObject(), 
      category: product.category.name
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate({
        path: 'category',
        select: 'name',
      })
      .sort({ rating: -1 })
      .limit(4);
    
    const formattedProducts = products.map(product => ({
      ...product.toObject(), 
      category: product.category.name
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find()
    .populate({
      path: 'category',
      select: 'name',
    })
    .sort({ _id: -1 }).limit(5);
    const formattedProducts = products.map(product => ({
      ...product.toObject(), 
      category: product.category.name
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
