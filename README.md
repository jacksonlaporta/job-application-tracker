# Job Application Tracker

Track job applications in one place: which roles are saved, applied for, at interview or closed.

> Status: updated on 17 November 2026. Checkpoint 1 is built: applications can be created, listed with the newest first, and moved between the four stages. Checkpoint 2 has started: the sign-in route and its callback exist, and there are no sessions yet, so the page is still open to everyone.

## Tech stack

- Next.js with the App Router, React and TypeScript
- Tailwind CSS
- PostgreSQL 18, run locally with Docker Compose
- Prisma ORM 7 for data access and migrations
- Jest for unit tests
- Amazon Cognito for sign-in, with the user pool defined with AWS CDK in `infra/` (in progress)
- Playwright for an end-to-end test of the main flow (planned)

## Roadmap

The project is built in checkpoints. The later ones are an outline and may change.

| Checkpoint | Scope                                                                                                                                | Status                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| 1          | Local application with Next.js and PostgreSQL: create applications, list them and change their stage                                 | Built, review on 17 November 2026    |
| 2          | Accounts and permissions with Amazon Cognito: sign-in, sessions, and each user limited to their own applications                     | In progress                          |
| 3          | Deployment and troubleshooting on AWS: Docker, AWS CDK, Amazon ECS, health checks, CloudWatch logs and rolling back a failed release | Planned                              |
| 4          | Importing applications from a CSV file in the background with Amazon SQS, with retries that create no duplicates                     | Planned, if it fits the target roles |

## Requirements

- Node.js 24. The exact version is in `.nvmrc`
- npm
- Docker, to run PostgreSQL

## Getting started from a fresh clone

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Create the environment file and review its values:

   ```bash
   cp .env.example .env
   ```

3. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

4. Apply the migrations:

   ```bash
   npx prisma migrate deploy
   ```

   This creates the table, the stage enum and the check constraints in the empty database. The Prisma client is not committed: `npm ci` generates it through the `postinstall` script.

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000. With an empty database, the page shows "No applications yet. Add the first one with the form above."

### Environment variables

| Variable            | Purpose                                                           |
| ------------------- | ----------------------------------------------------------------- |
| `POSTGRES_USER`     | Database user, created when the data volume is first initialised  |
| `POSTGRES_PASSWORD` | Password for that user                                            |
| `POSTGRES_DB`       | Database created on first start                                   |
| `POSTGRES_PORT`     | Port on your machine that maps to PostgreSQL. Defaults to 5432    |
| `DATABASE_URL`      | Connection string used by the app. It must match the values above |

If another PostgreSQL is already listening on port 5432, set `POSTGRES_PORT` to a free port such as 5433 and use the same port in `DATABASE_URL`.

The user, password and database name are applied only when the data volume is first created. To change them later, reset the database.

The variables that start with `COGNITO_`, and `APP_URL`, belong to Checkpoint 2. They can stay empty: the page that lists and creates applications does not use them. Only the routes under `/auth` need them, and those routes also need the user pool from `infra/` deployed to an AWS account. The steps for that will be written when sign-in is complete.

### Database commands

| Purpose                    | Command                  |
| -------------------------- | ------------------------ |
| Start the database         | `docker compose up -d`   |
| Check that it is running   | `docker compose ps`      |
| Stop it and keep the data  | `docker compose down`    |
| Reset to an empty database | `docker compose down -v` |

### Prisma commands

| Purpose                                                      | Command                                              |
| ------------------------------------------------------------ | ---------------------------------------------------- |
| Apply the committed migrations                               | `npx prisma migrate deploy`                          |
| Generate the client again after changing the schema          | `npx prisma generate`                                |
| Create a migration after changing the schema                 | `npx prisma migrate dev --name <name>`               |
| Write a migration without applying it, to edit its SQL first | `npx prisma migrate dev --create-only --name <name>` |

The Prisma CLI reads its settings, including the database URL, from `prisma7.config.ts`. That is the file name used by Prisma ORM 7.10 and later, and the CLI finds it without a `--config` flag.

Names: the Prisma schema uses singular models and camelCase fields, such as `Application` and `createdAt`. The database uses plural snake_case names, such as `applications` and `created_at`. SQL written by hand uses the database names.

## Verification commands

| Purpose                               | Command                 |
| ------------------------------------- | ----------------------- |
| Lint                                  | `npm run lint`          |
| Production build                      | `npm run build`         |
| Type check                            | `npm run typecheck`     |
| Unit tests                            | `npm test`              |
| Unit tests, run again on every change | `npm run test:watch`    |
| Unit tests with a coverage report     | `npm run test:coverage` |
| End-to-end test                       | Not set up yet          |

The coverage run prints a table and writes the full report to `coverage/`. To read it, open `coverage/lcov-report/index.html` in a browser.

## Development workflow

- `main` is protected: every change goes through a pull request.
- The CI workflow must pass before merging. It runs the lint, the production build, the type check and the unit tests.
- Each pull request is reviewed automatically by Claude Code, through a GitHub Actions workflow, and read by its author. The review is advisory: it never blocks a merge, and any fix is written by hand.
- Pull requests are squash merged, and their branches are deleted automatically.

## How it works

- Reading: the home page is a Server Component. The list component reads the applications from PostgreSQL through Prisma, on the server and on every request, newest first. It sits inside a `<Suspense>` boundary, so the rest of the page is prerendered and the list is streamed in.
- Creating: the form is a Client Component that calls a Server Action. The action validates the input on the server, saves the application with the stage Saved, and asks Next.js to render the page again, so the list shows it. When the input is wrong, the action returns one message for each field and the values that were typed, and nothing is saved.
- Changing the stage: each application has a small form with the four stages. Its Server Action checks the stage and the id, then updates the record. When no record has that id any more, it says that the application could not be found.
- Validation: `app/lib/validation.ts` checks a new application. Company and job title are required and trimmed, and the URL is optional and must use http or https. `app/lib/stage-input.ts` checks a change of stage: the stage is one of the four, and the id is a whole number from 1 to the largest PostgreSQL integer. The database also rejects a blank company or job title, with check constraints, and its stage column accepts only the four values.
- Failures: when the database fails during a write, the page shows a plain message and keeps what was typed. The technical details go to the server log.
- Logs: errors are written as one JSON line each, by `app/lib/logger.ts`. `instrumentation.ts` logs the server errors that the code does not handle.
- Sign-in, in progress: `/auth/sign-in` sends the browser to the sign-in pages that Amazon Cognito hosts, with a new `state` value and a new PKCE verifier kept in an `HttpOnly` cookie. `/auth/callback` checks the `state`, exchanges the code for tokens on the server, and checks the ID token. No session is created yet.

## Project structure

| Folder                  | Purpose                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `app/`                  | The routes: pages and layouts, plus the folders below                                   |
| `app/lib/`              | Code that is not a component: the Prisma client, data access, validation and the logger |
| `app/ui/`               | React components                                                                        |
| `app/auth/`             | The sign-in route and its callback (Checkpoint 2, in progress)                          |
| `app/generated/prisma/` | The Prisma client, generated by `npm ci`. Not committed                                 |
| `prisma/`               | The database schema and the migrations                                                  |
| `infra/`                | A separate AWS CDK app, with its own dependencies: the Cognito user pool                |
| `instrumentation.ts`    | Logs the server errors that the code does not handle                                    |
| `docs/`                 | Project documents                                                                       |
| `.github/workflows/`    | The CI workflow and the automatic review                                                |

## Documentation

- `docs/PROCESS.md`: answers, manual test results and decisions for the checkpoint review
