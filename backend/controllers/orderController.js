import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Create Order
const createOrder = async (req, res) => {
  try {
    const { staff, products, shippingAddress, paymentMethod } = req.body;

    // Validate input
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products specified" });
    }

    // Fetch products from the database
    const productsFromDB = await Product.find({
      _id: { $in: products.map((item) => item.product) },
    });

    // Map the products to include necessary details
    const dbProducts = products.map((item) => {
      const productFromDB = productsFromDB.find(
        (dbProduct) => dbProduct._id.toString() === item.product
      );

      if (!productFromDB) {
        throw new Error(`Product not found: ${item.product}`);
      }

      return {
        product: item.product, // Product ID
        name: productFromDB.name, // Get name from the database
        quantity: item.quantity,
        price: productFromDB.price,
      };
    });

    // Calculate total price
    const totalPrice = dbProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Create a new order
    const order = new Order({
      products: dbProducts,
      staff,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    // Save the order to the database
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    // Return structured error response
    res.status(500).json({ error: error.message });
  }
};

// Get All Orders
const getAllOrders = async (req, res) => {
  try {
      // Fetch all orders and populate the product field
      const orders = await Order.find({})
          .populate({
              path: 'products.product', // Assuming products is an array of objects with a 'product' field
              select: 'name _id' // Select only name and _id
          })
          .exec();

      // Format the orders to include only necessary fields
      const formattedOrders = orders.map(order => ({
          _id: order._id,
          staff: order.staff,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          totalPrice: order.totalPrice,
          isPaid: order.isPaid,
          isDelivered: order.isDelivered,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          products: order.products.map(product => ({
              product: product.product._id, // Product ID
              name: product.product.name, // Product name
              quantity: product.quantity,
              price: product.price
          }))
      }));

      res.json(formattedOrders);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Get Orders for Logged-in User
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Count Total Orders
const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate Total Sales
const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate Sales by Date
const calculateTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    // Fetch the order by ID and populate the product details
    const order = await Order.findById(req.params.id)
      .populate({
        path: 'products.product', // Assuming products is an array of objects with a 'product' field
        select: 'name _id' // Select only name and _id
      })
      .exec();

    // Check if the order was found
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Format the order to include only necessary fields
    const formattedOrder = {
      _id: order._id,
      staff: order.staff,
      shippingAddress: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      isDelivered: order.isDelivered,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      products: order.products.map(product => ({
        product: product.product._id, // Product ID
        name: product.product.name, // Product name
        quantity: product.quantity,
        price: product.price
      }))
    };

    res.json(formattedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Order as Paid
const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Order as Delivered
const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteOrderById = async (req, res) => {
  try {
    // Use findByIdAndDelete to find and remove the order in one step
    const order = await Order.findByIdAndDelete(req.params.id);

    if (order) {
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  deleteOrderById,
};
