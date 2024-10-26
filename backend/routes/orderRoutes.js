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
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

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
 *             example:
 *               products: [
 *                 { product: "product_id_1", quantity: 20 },
 *                 { product: "product_id_2", quantity: 10 }
 *               ]
 *               shippingAddress:
 *                 name: "John Doe"
 *                 age: 30
 *                 address: "120 Long Thanh My HCM THU DUC"
 *                 phoneNumber: "1234567890"
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
router.route("/").post(createOrder).get(authenticate, authorizeAdmin, getAllOrders);

/**
 * @swagger
 * /api/orders/mine:
 *   get:
 *     summary: Get current user's orders
 *     description: Fetches all orders for the authenticated user.
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Unauthorized
 */
router.route("/mine").get(authenticate, getUserOrders);

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
router.route("/count").get(authenticate, authorizeAdmin, countTotalOrders);

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
router.route("/total-sales").get(authenticate, authorizeAdmin, calculateTotalSales);

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
router.route("/total-sales-by-date").get(authenticate, authorizeAdmin, calculateTotalSalesByDate);

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
router.route("/:id").get(authenticate, findOrderById);

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
router.route("/:id/pay").put(authenticate, markOrderAsPaid);

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
router.route("/:id/deliver").put(authenticate, markOrderAsDelivered);

export default router;
