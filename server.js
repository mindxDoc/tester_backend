require("dotenv").config();
const express = require('express');
const db = require("../backend/db");

const morgan = require('morgan');

const app = express(),
    swaggerJsdoc = require("swagger-jsdoc"),
    swaggerUi = require("swagger-ui-express");

app.use(express.json());
const port = process.env.PORT || 3001;

const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Book Review API with Swagger",
            version: "0.1.0",
            description:
                "MindX Book Review API for Software Testing Program",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "MindX Technology School",
                url: "https://mindx.vn",
                email: "contact@mindx.edu.vn",
            },
        },
        servers: [
            {
                url: `${process.env.SWAGGER_URL}${port}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

// Create GET request
app.get("/", (req, res) => {
    res.send("Learn on MindX");
  });

app.get('/api/v1/books', async (req, res) => {
    try {
        const results = await db.query("SELECT * FROM books");
        res.status(200).json({
            status: "success",
            results: results.rows.length,
            data: {
                book: results.rows,
            }
        })
    } catch (err) {
        console.log(err);
    }
});

// Get a book
app.get('/api/v1/books/:id', async (req, res) => {
    try {
        const results = await db.query(`SELECT * FROM books WHERE id = ${req.params.id}`);
        res.status(200).json({
            status: "success",
            data: {
                book: results.rows[0],
            }
        })
    } catch (err) {
        console.log(err);
    }
});

// Create a book
app.post('/api/v1/books', async (req, res) => {
    try {
        const results = await db.query("INSERT INTO books (title, author, price) VALUES ($1, $2, $3) RETURNING *",
            [req.body.title, req.body.author, req.body.price]);
        res.status(200).json({
            status: "success",
            data: {
                book: results.rows[0],
            }
        })
    } catch (err) {
        console.log(err);
    }
});

// Update a book
app.put('/api/v1/books/:id', async (req, res) => {
    try {
        const results = await db.query("UPDATE books SET title = $1, author = $2, price = $3 WHERE id = $4 RETURNING *",
            [req.body.title, req.body.author, req.body.price, req.params.id]);
        res.status(200).json({
            status: "success",
            data: {
                book: results.rows[0],
            }
        })
    } catch (error) {
        console.log(err);
    }
});

// Delete a book
app.delete('/api/v1/books/:id', async (req, res) => {
    try {
        const results = db.query("DELETE FROM books WHERE id = $1", [
            req.params.id,
        ]);
        res.status(204).json({
            status: "success"
        })
    } catch (err) {
        console.log(err);
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;