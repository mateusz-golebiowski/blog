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
    language_id BIGSERIAL,
    username TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_article FOREIGN KEY(article_id) REFERENCES articles(article_id),
    CONSTRAINT fk_language FOREIGN KEY(language_id) REFERENCES languages(language_id)
);

INSERT INTO languages (language_id, name, code) VALUES(1, 'English', 'en');
INSERT INTO roles (role_id, name) VALUES(1, 'Admin');
INSERT INTO roles (role_id, name) VALUES(2, 'Moderator');
INSERT INTO roles (role_id, name) VALUES(3, 'Publisher');