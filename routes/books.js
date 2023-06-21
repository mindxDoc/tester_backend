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