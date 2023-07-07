import { Router } from 'express';
import authorize from '../middleware/authorize.js';
import { query } from "../db/index.js";

const userRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_id
 *         - user_name
 *         - user_email
 *         - user_password
 *       properties:
 *         user_id:
 *           type: string
 *           example: dcc98be0-a461-4116-b371-2d8d59fd57de
 *           description: The id of the account
 *         user_name:
 *           type: string
 *           example: admin
 *           description: The name of account
 *         user_email:
 *           type: string
 *           example: admin@mindx.vn
 *           description: The email of account
 *         user_password:
 *           type: string
 *           example: 1000000
 *           description: The password of account
 *       example:
 *         user_id: 'dcc98be0-a461-4116-b371-2d8d59fd57de'
 *         user_name: 'Admin'
 *         user_email: admin@mindx.vn
 *         user_password: '$2b$10$z1rHMSrKBz3SF3vfvmVH5OJkuyWvVWijub9mg1Y0osB/IsnD9jye.'
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /api/v1/user:
 *   get:
 *     summary: Get current user logged in
 *     tags: [Users]
 *     parameters:
 *       - name: token
 *         in: header
 *         description: 'token'
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list of the reviewed book
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/User'
 */

userRouter.get("/", authorize, async (req, res) => {
    try {

        // Fetch the user information from the database using the user ID
        const user = await query("SELECT user_id, user_name, user_email FROM users WHERE user_id = $1", [req.user.id]);
        console.log(user);

        // Check if the user exists
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user information in the response
        res.status(200).json({
            status: "success",
            data: { user: user.rows }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default userRouter;