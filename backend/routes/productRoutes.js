import express from "express";
const router = express.Router();

// controllers
import {
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
} from "../controllers/productController.js";
import checkId from "../middlewares/checkId.js";


/**
 * @openapi
 * /api/products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add a new product
 *     security:
 *       - bearerAuth: []  # Specify that this endpoint requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:  # Changed to application/json
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *                 example: test3
 *               brand:
 *                 type: string
 *                 description: Brand of the product
 *                 example: vendo
 *               description:
 *                 type: string
 *                 description: Description of the product
 *                 example: test1
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 100
 *               category:
 *                 type: string
 *                 description: Category ID of the product
 *                 example: 670172c4a884b2a83eb03d30
 *               quantity:
 *                 type: number
 *                 description: Quantity of the product in stock
 *                 example: 18
 *               image:
 *                 type: string
 *                 description: Image URL for the product
 *                 example: http://example.com/image.jpg
 *               image2:
 *                 type: string
 *                 description: Image URL for the product
 *                 example: http://example.com/image2.jpg
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad Request - Missing required fields or validation error
 *       401:
 *         description: Unauthorized - Invalid token
 *       500:
 *         description: Internal Server Error - Failed to create product
 */
router.route("/").post(addProduct);

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Fetch all products
 *     description: Retrieve a list of products, optionally filtered by keyword and category.
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         description: Search keyword to filter products by name.
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *         description: Category ID to filter products.
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: The unique identifier for the product
 *                       name:
 *                         type: string
 *                         description: The name of the product
 *                       brand:
 *                         type: string
 *                         description: The brand of the product
 *                       description:
 *                         type: string
 *                         description: The description of the product
 *                       price:
 *                         type: number
 *                         description: The price of the product
 *                       quantity:
 *                         type: number
 *                         description: The quantity available in stock
 *                       category:
 *                         type: string
 *                         description: The name of the category
 *                       image:
 *                         type: string
 *                         description: URL of the product image
 *                       image2:
 *                         type: string
 *                         description: URL of an additional product image
 *                       rating:
 *                         type: number
 *                         description: The average rating of the product
 *                       numReviews:
 *                         type: number
 *                         description: The number of reviews for the product
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */
router.route("/").get(fetchProducts);

/**
 * @openapi
 * /api/products/allproducts:
 *  get:
 *    tags:
 *    - Products
 *    summary: Fetch all products without filters
 *    responses:
 *      200:
 *        description: All products retrieved successfully
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                  name:
 *                    type: string
 *                  brand:
 *                    type: string
 *                  price:
 *                    type: number
 *                  category:
 *                    type: string
 *                  quantity:
 *                    type: number
 *                  description:
 *                    type: string
 *                  image:
 *                    type: string
 *      500:
 *        description: Server error
 */
router.route("/allproducts").get(fetchAllProducts);

/**
 * @openapi
 * /api/products/{id}/reviews:
 *   post:
 *     tags:
 *       - Products
 *     summary: Add a review for a product
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to review
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user submitting the review
 *               rating:
 *                 type: number
 *                 description: Rating of the product (1 to 5)
 *               comment:
 *                 type: string
 *                 description: Review comment
 *     responses:
 *       201:
 *         description: Review added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.route("/:id/reviews").post(checkId, addProductReview);

/**
 * @openapi
 * /api/products/top:
 *   get:
 *     tags:
 *       - Products
 *     summary: Fetch top-rated products
 *     responses:
 *       200:
 *         description: Successfully retrieved top-rated products
 *       500:
 *         description: Server error
 */
router.get("/top", fetchTopProducts);

/**
 * @openapi
 * /api/products/new:
 *   get:
 *     tags:
 *       - Products
 *     summary: Fetch newly added products
 *     responses:
 *       200:
 *         description: Successfully retrieved newly added products
 *       500:
 *         description: Server error
 */
router.get("/new", fetchNewProducts);

/**
 * @openapi
 * /api/products/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get a product by ID (admin access required)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   put:
 *     tags:
 *       - Products
 *     summary: Update a product by ID (admin access required)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               brand:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               image:
 *                 type: string
 *               image2:
 *                 type: string
 *             required:
 *               - name
 *               - brand
 *               - description
 *               - price
 *               - category
 *               - quantity
 *               - image
 *           example:
 *             name: "Thẻ đeo dây Đinh Bộ Lĩnh"
 *             brand: "Vipack"
 *             description: "Lấy cảm hứng từ vị tướng cờ lau, người đã làm nên một nước Việt thống nhất, bộ sưu tập này không chỉ thể hiện tình yêu lịch sử, mà còn tôn vinh bản lĩnh oai hùng của dân tộc. Mỗi chiếc dây đeo thẻ đều là một lời tuyên ngôn lịch sử, một cách thể hiện đam mê mà bạn có thể đeo trên mình!"
 *             price: 100000
 *             category: "671de6b69c6278fcbe330573"
 *             quantity: 1000
 *             image: "https://firebasestorage.googleapis.com/v0/b/vipack-project.appspot.com/o/products-image1%2FIMG_0042.jpg?alt=media&token=707eac97-db3c-40e5-a6fd-ffff40e7dea3"
 *             image2: "https://firebasestorage.googleapis.com/v0/b/vipack-project.appspot.com/o/products-image1%2FIMG_0042.jpg?alt=media&token=707eac97-db3c-40e5-a6fd-ffff40e7dea3"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     brand:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *                     category:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     image:
 *                       type: string
 *                     image2:
 *                       type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 *   delete:
 *     tags:
 *       - Products
 *     summary: Delete a product by ID (admin access required)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router
  .route("/:id")
  .get(fetchProductById)
  .put(updateProductDetails)
  .delete(removeProduct);

/**
 * @openapi
 * /api/products/filtered-products:
 *   post:
 *     tags:
 *       - Products
 *     summary: Filter products based on specific criteria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               criteria:
 *                 type: object
 *                 description: Filtering criteria
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered products
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.route("/filtered-products").post(filterProducts);

export default router;