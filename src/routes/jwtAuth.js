import { Router } from "express";
import bcrypt from "bcrypt";
import { query } from "../db/index.js";
import validInfo from "../middleware/validInfo.js";
import jwtGenerator from "../utils/jwtGenerator.js";
import authorize from "../middleware/authorize.js";

const authRouter = Router();

//authorize authentication

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Create a new account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                name:
 *                  type: string
 *                  example: admin
 *                  description: The name of account
 *                email:
 *                  type: string
 *                  example: admin@mindx.vn
 *                  description: The email of account
 *                password:
 *                  type: string
 *                  example: mindxdream
 *                  description: The password of account
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  jwtToken:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZGNjOThiZTAtYTQ2MS00MTE2LWIzNzEtMmQ4ZDU5ZmQ1N2RlIn0sImlhdCI6MTY4Nzg0MDE5MywiZXhwIjoxNjg3ODQzNzkzfQ.1eN0ujw-SqzHdZ9CEDDWCSyBMHMlfL5dfWwrrHT2Yww
 *       500:
 *         description: Some server error
 */

authRouter.post("/register", validInfo, async (req, res) => {
    const { email, name, password } = req.body;

    try {
        const user = await query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if (user.rows.length > 0) {
            return res.status(401).json("User already exist!");
        }

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        let newUser = await query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );

        const jwtToken = jwtGenerator(newUser.rows[0].user_id);

        return res.json({ jwtToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login into an account
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                email:
 *                  type: string
 *                  example: admin@mindx.vn
 *                  description: The email of account
 *                password:
 *                  type: string
 *                  example: mindxdream
 *                  description: The password of account
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  jwtToken:
 *                      type: string
 *                      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiZGNjOThiZTAtYTQ2MS00MTE2LWIzNzEtMmQ4ZDU5ZmQ1N2RlIn0sImlhdCI6MTY4Nzg0MDE5MywiZXhwIjoxNjg3ODQzNzkzfQ.1eN0ujw-SqzHdZ9CEDDWCSyBMHMlfL5dfWwrrHT2Yww
 *       500:
 *         description: Some server error
 */

authRouter.post("/login", validInfo, async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await query("SELECT * FROM users WHERE user_email = $1", [
            email
        ]);

        if (user.rows.length === 0) {
            return res.status(401).json("Invalid Credential");
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].user_password
        );

        if (!validPassword) {
            return res.status(401).json("Wrong password");
        }
        const jwtToken = jwtGenerator(user.rows[0].user_id);
        return res.json({ jwtToken });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                name:
 *                  type: string
 *                  example: admin
 *                  description: The name of account
 *                email:
 *                  type: string
 *                  example: admin@mindx.vn
 *                  description: The email of account
 *                password:
 *                  type: string
 *                  example: mindxdream
 *                  description: The password of account
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  message:
 *                      type: string
 *                      example: Logout successful
 *       500:
 *         description: Some server error
 */

authRouter.post("/logout", (req, res) => {
    try {
        // Clear the JWT token from the client-side (e.g., remove it from cookies, local storage, etc.)

        // Respond with a success message
        res.json({ message: "Logout successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

authRouter.get("/verify", authorize, (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

export default authRouter;
