# News API

You can view the hosted API here: https://news-api-izsx.onrender.com

## Cloning the repo

---

In order to connect to your database you will need to set up the environment variables. Create two .env files for your project, one for your test database and one for your development database.

You can find the databse names in the sql files. Found at ./db/setup.sql.

In each file, add PGDATABASE=<database_name_here>

Ensure to gitignore these files if they contain sensitive information.

## Summary

---

This API gives access to articles, comments, topics and users from the news database.

## Installation

---

1. Clone the repository: `git@github.com:rorybush/news-api.git`

2. Install the dependencies:

   `npm i`

   `npm i express`

   `npm i dotenv`

   `npm i pg`

   `npm i -D jest`

   `npm i -D pg-format`

   `npm i -D supertest`

   `npm i -D jest-sorted`

3. Create 2 ENV files. Add `PGDATABASE=<database_name>` to the `.env.test` and `.env.development` files.

4. Seed the local database: `npm run setup-dbs` `npm run seed`

5. Use the following command to run the test: `npm t`

## Minimum Requirements

Node.js `18.10.0`

Postgres `^8.7.3`
