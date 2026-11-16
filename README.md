# Job Application Tracker

Track job applications in one place: which roles are saved, applied for, at interview or closed.

> Status: Checkpoint 1 in progress, updated on 16 November 2026. Working today: the database set-up, the list of applications with its empty state, and the validation of a new application. In progress: the form that creates an application, and the change of stage.

## Tech stack

- Next.js with the App Router, React and TypeScript
- Tailwind CSS
- PostgreSQL 18, run locally with Docker Compose
- Prisma ORM 7 for data access and migrations
- Jest for unit tests
- Playwright for an end-to-end test of the main flow (planned)

## Roadmap

The project is built in checkpoints. The later ones are an outline and may change.

| Checkpoint | Scope                                                                                                                                | Status                               |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------ |
| 1          | Local application with Next.js and PostgreSQL: create applications, list them and change their stage                                 | In progress                          |
| 2          | Accounts and permissions with Amazon Cognito: sign-in, sessions, and each user limited to their own applications                     | Planned                              |
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

6. Open http://localhost:3000. With an empty database, the page shows "No applications yet."

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
- Validation: `app/lib/validation.ts` checks the input of a new application on the server. Company and job title are required and trimmed. The URL is optional and must use http or https. The database also rejects a blank company or job title, with check constraints.
- Writing: the form and the Server Actions that create an application and change its stage are in progress.
- Logs: a server error that the code does not handle is written as one JSON line, by `instrumentation.ts` and `app/lib/logger.ts`.

## Project structure

| Folder                  | Purpose                                                                                 |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `app/`                  | The routes: pages and layouts, plus the folders below                                   |
| `app/lib/`              | Code that is not a component: the Prisma client, data access, validation and the logger |
| `app/ui/`               | React components                                                                        |
| `app/generated/prisma/` | The Prisma client, generated by `npm ci`. Not committed                                 |
| `prisma/`               | The database schema and the migrations                                                  |
| `instrumentation.ts`    | Logs the server errors that the code does not handle                                    |
| `docs/`                 | Project documents                                                                       |
| `.github/workflows/`    | The CI workflow and the automatic review                                                |

## Documentation

- `docs/PROCESS.md`: answers, manual test results and decisions for the checkpoint review
