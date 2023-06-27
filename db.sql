CREATE DATABASE authbookreview;

CREATE TABLE users (
    user_id UUID DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE books (
    book_id SERIAL,
    user_id UUID,
    book_title VARCHAR(255) NOT NULL,
    book_author VARCHAR(255) NOT NULL,
    book_review VARCHAR(255) NOT NULL,
    PRIMARY KEY (book_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
INSERT INTO users(user_name, user_email, user_password) VALUES ('dauphin', 'dolp@mindx.vn', 'mindx@dream');

INSERT INTO books(user_id, book_title, book_author, book_review) VALUES ('5aea1f0b-c5ae-498d-a74b-12abf5cd3223','Sapien', 'Yuval Noah Harari', 'apiens tackles the biggest questions of history and of the modern world, and it is written in unforgettably vivid language');