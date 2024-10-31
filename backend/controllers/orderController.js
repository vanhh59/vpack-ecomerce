import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import payOS from "../utils/payos.js"; // Điều chỉnh đường dẫn nếu cần

// Hàm kiểm tra URL hợp lệ
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Create an order and generate a payment link
export const createOrder = async (req, res) => {
  try {
    const { staff, products, shippingAddress, paymentMethod, description, cancelUrl } = req.body;

    // Set default returnUrl
    const returnUrl = req.body.returnUrl || 'http://localhost:8082/docs/success.html';

    // Validate input products
    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Danh sách sản phẩm không được để trống" });
    }

    // Validate description length
    if (description && description.length > 25) { // Điều chỉnh số lượng ký tự mong muốn
      return res.status(400).json({ message: "Mô tả tối đa 25 kí tự" });
    }

    // Validate URLs if provided
    if (returnUrl && !isValidUrl(returnUrl)) {
      return res.status(400).json({ message: "URL không hợp lệ cho returnUrl" });
    }
    if (cancelUrl && !isValidUrl(cancelUrl)) {
      return res.status(400).json({ message: "URL không hợp lệ cho cancelUrl" });
    }

    // Fetch product details from the database
    const productsFromDB = await Product.find({
      _id: { $in: products.map((item) => item.product) },
    });

    // Prepare product list with necessary information
    const dbProducts = products.map((item) => {
      const productFromDB = productsFromDB.find(
        (dbProduct) => dbProduct._id.toString() === item.product
      );

      if (!productFromDB) {
        throw new Error(`Không tìm thấy sản phẩm với ID: ${item.product}`);
      }

      return {
        product: item.product,
        name: productFromDB.name,
        quantity: item.quantity,
        price: productFromDB.price,
      };
    });

    // Calculate total order value
    const totalPrice = dbProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Create order in the database
    const order = new Order({
      products: dbProducts,
      staff,
      shippingAddress,
      paymentMethod,
      totalPrice,
      description,
    });

    const createdOrder = await order.save();

    // Prepare payment link creation information
    const paymentLinkData = {
      orderCode: Number(String(new Date().getTime()).slice(-6)),
      amount: totalPrice,
      description: `Thanh toán dây đeo`,
      cancelUrl: cancelUrl || `http://localhost:8082/docs/cancel.html`,
      returnUrl: returnUrl, // Sử dụng returnUrl đã đặt
    };

    // Create payment link via payOS
    const paymentLinkRes = await payOS.createPaymentLink(paymentLinkData);

    // Return order information and payment data
    res.status(201).json({
      message: "Đơn hàng và link thanh toán đã được tạo thành công",
      order: createdOrder,
      paymentData: {
        bin: paymentLinkRes.bin,
        checkoutUrl: paymentLinkRes.checkoutUrl,
        accountNumber: paymentLinkRes.accountNumber,
        accountName: paymentLinkRes.accountName,
        amount: paymentLinkRes.amount,
        description: paymentLinkRes.description,
        orderCode: paymentLinkRes.orderCode,
        qrCode: paymentLinkRes.qrCode,
      },
    });
  } catch (error) {
    console.error(error); // Log lỗi để debug
    res.status(500).json({ error: error.message });
  }
};


// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userOrders = await Order.find({ user: userId }).populate("products.product", "name price");
    res.status(200).json(userOrders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Count total orders
export const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.status(200).json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate total sales from all orders
export const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    res.status(200).json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Calculate sales by date
export const calculateTotalSalesByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const orders = await Order.find({
      createdAt: { $gte: new Date(date), $lt: new Date(date).setDate(new Date(date).getDate() + 1) }
    });
    const totalSalesByDate = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    res.status(200).json({ totalSalesByDate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find order by ID
export const findOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate("products.product", "name price");
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark order as paid
export const markOrderAsPaid = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findByIdAndUpdate(orderId, { isPaid: true }, { new: true });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark order as delivered
export const markOrderAsDelivered = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findByIdAndUpdate(orderId, { isDelivered: true }, { new: true });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Soft delete order by updating its status
export const deleteOrderById = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findByIdAndUpdate(orderId, { status: "deleted" }, { new: true });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    res.status(200).json({ message: "Đơn hàng đã được xóa", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export functions for use in other modules
// export {
//   createOrder,
//   getAllOrders,
//   getUserOrders,
//   countTotalOrders,
//   calculateTotalSales,
//   calculateTotalSalesByDate,
//   findOrderById,
//   markOrderAsPaid,
//   markOrderAsDelivered,
//   deleteOrderById,
// };
