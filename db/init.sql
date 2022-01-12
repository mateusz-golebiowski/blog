CREATE DATABASE blog;
\c blog

CREATE TABLE languages (
    language_id BIGSERIAL PRIMARY KEY,
    name TEXT,
    code TEXT UNIQUE
);

CREATE TABLE roles (
    role_id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE
);

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    role_id BIGSERIAL,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_role FOREIGN KEY(role_id) REFERENCES roles(role_id)

);

CREATE TABLE articles (
    article_id BIGSERIAL PRIMARY KEY,
    user_id BIGSERIAL,
    language_id BIGSERIAL,
    title TEXT,
    content TEXT,
    mainImage TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id),
    CONSTRAINT fk_language FOREIGN KEY(language_id) REFERENCES languages(language_id)
);

CREATE TABLE comments (
    comment_id BIGSERIAL PRIMARY KEY,
    article_id BIGSERIAL,
    username TEXT,
    email TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_article FOREIGN KEY(article_id) REFERENCES articles(article_id)
    );

CREATE TABLE categories (
    category_id BIGSERIAL PRIMARY KEY,
    name TEXT
);

CREATE TABLE articles_categories (
    article_id BIGSERIAL,
    category_id BIGSERIAL,
    CONSTRAINT fk_article FOREIGN KEY(article_id) REFERENCES articles(article_id),
    CONSTRAINT fk_category FOREIGN KEY(category_id) REFERENCES categories(category_id)
);

CREATE TABLE languages_categories (
    language_category_id BIGSERIAL PRIMARY KEY,
    language_id BIGSERIAL,
    category_id BIGSERIAL,
    value TEXT,
    CONSTRAINT fk_language FOREIGN KEY(language_id) REFERENCES languages(language_id),
    CONSTRAINT fk_category FOREIGN KEY(category_id) REFERENCES categories(category_id)
);

INSERT INTO languages (name, code) VALUES('English', 'en');
INSERT INTO languages (name, code) VALUES('Polski', 'pl');
INSERT INTO roles (role_id, name) VALUES(1, 'Admin');
INSERT INTO roles (role_id, name) VALUES(2, 'Moderator');
INSERT INTO roles (role_id, name) VALUES(3, 'Publisher');
INSERT INTO categories (name) VALUES('Software');
INSERT INTO categories (name) VALUES('Hardware');
INSERT INTO languages_categories (language_id, category_id, value) VALUES(1,1, 'Software');
INSERT INTO languages_categories (language_id, category_id, value) VALUES(1,2, 'Hardware');
INSERT INTO languages_categories (language_id, category_id, value) VALUES(2,1, 'Oprogramowanie');
INSERT INTO languages_categories (language_id, category_id, value) VALUES(2,2, 'Sprzęt');
