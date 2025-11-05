CREATE DATABASE FINSIGHT;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,                     -- Auto-increment user ID
  name VARCHAR(100) NOT NULL,                -- Full name of user
  email VARCHAR(100) UNIQUE NOT NULL,        -- User email (must be unique)
  password VARCHAR(200) NOT NULL,            -- Hashed password
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Timestamp when user joined
);


CREATE TABLE finance (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id) ON DELETE CASCADE,
title VARCHAR(100) NOT NULL,
amount NUMERIC(10,2),
category VARCHAR(50),
description TEXT,
date DATE DEFAULT CURRENT_DATE
);
