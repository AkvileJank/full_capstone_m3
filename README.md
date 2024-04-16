# Full-stack skill sharing app

## Description

This is a fully-functional full-stack typescript web app for joining or creating skill sharing lessons. It allows users to sign up, login, create, manage or attend lessons. Users are free to create lessons they would like to teach or join other users as learners in already created lessons!

## Tech stack

### Server
- Node.js with Express.js and TypeScript
- tRPC for API endpoints to ensure full-stack type safety
- PostgreSQL database with typeORM
- Zod for schema declaration and validation
- JWT for client auth
- Vitest for unit tests (test coverage ~90%)
- Pino for logging


### Client
- Vue.js with TypeScript
- Routing with VueRouter
- Tailwind CSS with Flowbite components for styling
- End-to-end (E2E) tests with Playwright
- Unit tests with Vitest
- Sentry for error tracking


### CI/CD
- Github Actions workflows for testing and deployment
- Docker for containerisation
- AWS Lightsail for deployment

### Code quality
- ESLint
- Prettier

## Functionalities

### A user can:
- sign up
- login
- create a lesson
- see lessons available to join
- join other users' lessons
- receive confirmation email after signing up and joining lesson
- withdraw from a joined lesson

### As a teacher, a user can:

- see all their created lessons
- edit and update a created lesson
- remove a created lesson


## Setup

To run the project on your local machine:

1. Clone this repository
2. Add missing values for variables in `docker-compose.yml`
3. In root repository run command:

```bash
   docker compose up

```
4. Visit http://localhost:3001/
