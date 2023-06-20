
# Tester Backend

Tester Backend: Book Review Service


## API Reference

#### Schema

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number`      |   The id of the book |
| `title` | `string`      |   **Required**. The title of your book |
| `author` | `string`      |   **Required**. The book author |
| `price` | `number` **currency**      |   **Required**. The pricing of the book |
| `created_at` | `number` **date**      |   **Required**. The date the book was added |

#### Get all books

```http
  GET /api/v1/books
```

#### Get a book

```http
  GET /api/v1/books/:id
```

#### Post a book
```http
  POST /api/v1/books
```

#### Update a book
```http
  PUT /api/v1/books/:id
```

#### Remove a book
```http
  DELETE /api/v1/books/:id
```