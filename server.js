import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import bookRouter from './src/routes/books.js';
import indexRouter from "./src/index.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 3001;
dotenv.config();

app.use(morgan("dev"));

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.1.0/swagger-ui.css";

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
    apis: ["src/**/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(specs, { customCssUrl: CSS_URL })
);

app.use("/", indexRouter);
app.use("/api/v1/books", bookRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default app;