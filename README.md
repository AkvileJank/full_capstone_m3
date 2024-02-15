## Description

This is an mvp of a website for joining or creating skill sharing lessons. It allows users to sign up and login, create, manage or attend lessons. Users are free to create lessons they would like to teach or join other users as learners in already created lessons!

## Functionalities

A user can:

- sign up
- login
- create a lesson
- see lessons available to join
- join other users' lessons
- receive confirmation email after signing up and joining lesson
- withdraw from a joined lesson

As a teacher, a user can:

- see all their created lessons
- edit and update a created lesson
- remove a created lesson


## Setup

1. `npm install` in root directory, client and server directories
2. Create 2 PostgreSQL databases: one for development, one for running tests (for `npm run test:db` command). Test database should be identical to development (same user, password, etc.), just with a different name.
4. Setup `.env` files in `server` based on `.env.example` files.
5. Configure server's `package.json` file:

Add test database name for `npm run test:db` and `coverage` commands:

```bash
    "test:db": "DB_NAME=test_database_name vitest",
    "coverage": "DB_NAME=test_database_name vitest run --coverage",
```

## See tRPC server in action with tRPCpanel's UI:

1. Run the server

```bash
npm run dev
```

2. On your web browser, go to: http://localhost:3000/panel

## Tests

!! Important note- when running all tests with real PostgreSQL database (`npm run test:db` command), first run will fail with errors related to table creation. On the second run all tests work as expected. I'm working on a way to fix this.

```bash
# using -w packageName is not required
# if you are already in the package directory

# back end tests with an in-memory database
npm test
# back end tests with a development copy database
npm run test:db
```

## Running the server

In development mode:

```bash
npm run dev
```
