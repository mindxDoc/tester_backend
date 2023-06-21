const express = require('express');
const dotevn = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require('path');

const bookRouter = require('./routes/books');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'))
const port = process.env.PORT || 3001;
dotevn.config();

app.use(morgan("dev"));

const CSS_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

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
                url: process.env.SWAGGER_URL,
                description: "My API Documentation",
            },
        ],
    },
    apis: ["./routes/books.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true, customCssUrl: CSS_URL })
);

app.use("/api/v1/books", bookRouter)

// Create GET request
app.get("/", (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, 'public') });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;