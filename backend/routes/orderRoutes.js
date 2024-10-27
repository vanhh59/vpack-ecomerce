import express from "express";
const router = express.Router();

import {
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
} from "../controllers/orderController.js";

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     description: Creates an order with specified items and shipping details.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               staff:
 *                 type: string
 *                 description: "Staff ID or name who is creating the order"
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: "Enter the product ID"
 *                     quantity:
 *                       type: integer
 *                       description: "Enter the quantity of the product"
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   age:
 *                     type: integer
 *                   address:
 *                     type: string
 *                   phoneNumber:
 *                     type: string
 *               paymentMethod:
 *                 type: string
 *                 description: "Payment method used for the order"
 *             required:
 *               - staff
 *               - products
 *               - shippingAddress
 *               - paymentMethod
 *             example:
 *               staff: "Nhan vien quan ly"
 *               products: 
 *                 - product: "671de826ba4c156250c6c494"
 *                   quantity: 20
 *                 - product: "product_id_2"
 *                   quantity: 10
 *               shippingAddress:
 *                 name: "Khach hang"
 *                 age: 30
 *                 address: "120 Long Thanh My HCM THU DUC"
 *                 phoneNumber: "1234567890"
 *               paymentMethod: "VN Pay"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request, no order items
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.route("/")
.post(createOrder)

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Retrieve all orders
 *     description: Returns a list of all orders with their details.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: "The unique identifier for the order."
 *                   staff:
 *                     type: string
 *                     description: "Staff ID or name who created the order."
 *                   shippingAddress:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       age:
 *                         type: integer
 *                       address:
 *                         type: string
 *                       phoneNumber:
 *                         type: string
 *                   paymentMethod:
 *                     type: string
 *                     description: "Payment method used for the order."
 *                   totalPrice:
 *                     type: integer
 *                     description: "Total price of the order."
 *                   isPaid:
 *                     type: boolean
 *                     description: "Indicates if the order has been paid."
 *                   isDelivered:
 *                     type: boolean
 *                     description: "Indicates if the order has been delivered."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: "Date and time when the order was created."
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: "Date and time when the order was last updated."
 *                   products:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         product:
 *                           type: string
 *                           description: "The ID of the product."
 *                         name:
 *                           type: string
 *                           description: "The name of the product."
 *                         quantity:
 *                           type: integer
 *                           description: "The quantity of the product ordered."
 *                         price:
 *                           type: integer
 *                           description: "The price of the product."
 *             example:
 *               - _id: "671df94c9279f5699d9bc3c5"
 *                 staff: "Nhan vien quan li order"
 *                 shippingAddress:
 *                   name: "Ten Khach Hang"
 *                   age: 30
 *                   address: "120 Long Thanh My HCM THU DUC"
 *                   phoneNumber: "1234567890"
 *                 paymentMethod: "VN Pay"
 *                 totalPrice: 1980000
 *                 isPaid: false
 *                 isDelivered: false
 *                 createdAt: "2024-10-27T08:26:52.320Z"
 *                 updatedAt: "2024-10-27T08:26:52.320Z"
 *                 products:
 *                   - product: "671de826ba4c156250c6c494"
 *                     name: "Thẻ đeo dây Đinh Bộ Lĩnh"
 *                     quantity: 20
 *                     price: 99000
 *       500:
 *         description: Internal server error
 */
.get(getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieves an order using its ID.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.route("/:id").get(findOrderById);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     description: Deletes a specific order using its ID.
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the order to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.route("/:id").delete(deleteOrderById);

router.route("/mine").get(getUserOrders);

/**
 * @swagger
 * /api/orders/count:
 *   get:
 *     summary: Get total orders count
 *     description: Returns total number of orders.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total orders count
 */
router.route("/count").get(countTotalOrders);

/**
 * @swagger
 * /api/orders/total-sales:
 *   get:
 *     summary: Get total sales amount
 *     description: Returns total sales amount from all orders.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total sales amount
 */
router.route("/total-sales").get(calculateTotalSales);

/**
 * @swagger
 * /api/orders/total-sales-by-date:
 *   get:
 *     summary: Get total sales grouped by date
 *     description: Returns total sales amount grouped by date.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Total sales by date
 */
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);

/**
 * @swagger
 * /api/orders/{id}/pay:
 *   put:
 *     summary: Mark order as paid
 *     description: Updates the order to reflect payment status.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order marked as paid
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.route("/:id/pay").put(markOrderAsPaid);

/**
 * @swagger
 * /api/orders/{id}/deliver:
 *   put:
 *     summary: Mark order as delivered
 *     description: Updates the order to reflect delivery status.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order marked as delivered
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.route("/:id/deliver").put(markOrderAsDelivered);

export default router;
