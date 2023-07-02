import { Router } from 'express';
import authorize from '../middleware/authorize.js';
import { query } from "../db/index.js";

const bookRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - price
 *         - publisher
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           example: 10
 *           description: The id of the book
 *         title:
 *           type: string
 *           example: Sapien
 *           description: The title of your book
 *         author:
 *           type: string
 *           example: Mark Twain
 *           description: The book author
 *         price:
 *           type: integer
 *           format: int64
 *           example: 1000000
 *           description: The pricing of the book
 *         publisher:
 *           type: string
 *           example: NXB Trẻ
 *           description: The publisher of the book
 *         created_at:
 *           type: string
 *           format: date
 *           description: The date the book was added
 *       example:
 *         id: 1
 *         title: 'Sapiens: Người tiến hóa'
 *         author: Yuval Noah Harari
 *         price: 250000
 *         publisher: NXB Văn Học
 *         created_at: 2022-03-10T04:05:06.157Z
 */

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: The books managing API
 */

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Lists all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

bookRouter.get('/', authorize, async (req, res) => {
    try {
        const results = await query("SELECT u.user_name, b.* FROM users u JOIN books b ON u.user_id = b.user_id WHERE u.user_id = $1", [req.user.id]);
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                book: results.rows,
            }
        })
    } catch (err) {
        console.log(err.message);
    }
});

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'Sapiens: Người tiến hóa'
 *               author:
 *                 type: string
 *                 example: Yuval Noah Harari
 *               price:
 *                 type: integer
 *                 example: 250000
 *               publisher:
 *                 type: string
 *                 example: NXB Văn Học
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       500:
 *         description: Some server error
 */

bookRouter.post('/', authorize, async (req, res) => {
    try {
        const results = await query("INSERT INTO books (user_id, book_title, book_author, book_review) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, req.body.title, req.body.author, req.body.review]);
        console.log(results);
        res.status(200).json({
            status: "success",
            data: {
                book: results.rows[0],
            }
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book response by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */

bookRouter.get('/:id', authorize, async (req, res) => {
    try {
        const results = await query(`SELECT * FROM books WHERE book_id = ${req.params.id}`);
        res.status(200).json({
            status: "success",
            data: {
                book: results.rows[0],
            }
        })
    } catch (err) {
        console.log(err.message);
    }
});

/**
 * @swagger
 * /api/v1/books/{id}:
 *   put:
 *    summary: Update the book by the id
 *    tags: [Books]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: number
 *        required: true
 *        description: The book id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: 'Sapiens: Người tiến hóa'
 *               author:
 *                 type: string
 *                 example: Yuval Noah Harari
 *               price:
 *                 type: integer
 *                 example: 250000
 *               publisher:
 *                 type: string
 *                 example: NXB Văn Học
 *    responses:
 *      200:
 *        description: The book was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Book'
 *      404:
 *        description: The book was not found
 *      500:
 *        description: Some error happened
 */

bookRouter.put('/:id', authorize, async (req, res) => {
    try {
        const results = await query("UPDATE books SET book_title = $1, book_author = $2, book_review = $3 WHERE book_id = $4 AND user_id = $5 RETURNING *",
            [req.body.title, req.body.author, req.body.review, req.params.id, req.user.id]);

        if (results.rows.length === 0) {
            return res.json("This book review is not yours");
        }

        res.status(200).json({
            status: "success",
            data: {
                book: results.rows[0],
            }
        })
    } catch (error) {
        console.log(err.message);
    }
});

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Remove the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The book id
 *
 *     responses:
 *       204:
 *         description: The book was deleted
 *       404:
 *         description: The book was not found
 */

bookRouter.delete('/:id', authorize, async (req, res) => {
    try {
        const results = query("DELETE FROM books WHERE book_id = $1 AND user_id = $2", [
            req.params.id, req.user.id
        ]);

        if (results.rows.length === 0) {
            return res.json("This book review is not yours");
        }

        res.status(204).json({
            status: "success"
        })
    } catch (err) {
        console.log(err.message);
    }
});

export default bookRouter;