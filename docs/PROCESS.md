# Process notes: Checkpoint 1

## Before coding

### 1. Which component would fetch the application list? Which part of the form needs code running in the browser?

The application list page component (server component), is responsible for fetching the list on the server. In contrast, the form submission triggered by the save button is the part that requires client-side code running in the browser.

### 2. Where does the data go between clicking Save and seeing the application in the list?

From the 'Add Application' page, client-side form data is sent to the server via a server function (HTTP POST). The server persists this data to the database through the ORM (after validation). Upon a successful database response, the application list page cache is invalidated and the user is redirected to the application list page, triggering a fresh HTTP GET request to fetch the updated data.
Flow: Server -> Database (ORM) -> Server -> Reloaded Data

### 3. Which rules would I validate in the Server Action? Which should also be enforced by the database?

Server Action validations:

Company:

- is not null
- is not empty
- is a string

Job title:

- is non null
- is not empty
- is a string

Job listing URL:

- is a valid URL

Stage:

- has "Saved", "Applied", "Interview" or "Closed" value

Database validations:

Company:

- is not null

Job title:

- is not null

Stage:

- is not null
- has "Saved", "Applied", "Interview" or "Closed" value

### 4. What should the user see if saving fails? How will I check that the app only shows success after saving?

If saving fails because of server validation, the user should see an error message or error messages listing the reasons and the form values should be kept.

If saving fails in the database, the server should log the errors and the user should see a message like: "An error occurred, please try again."

A database failure can be simulated to check if the app is only showing success after saving. Debugging the application and check the logs can also be used to check the behaviours.

### To check during implementation

- My answer 2 describes a separate page and a redirect. The brief asks for one page with the form and the list, so there is no redirect. The list is read from the database on every request, so there is no cache to invalidate either. To confirm while building the form: the Server Action calls `refresh()` from `next/cache`, and Next.js renders the page again in the same response.

## AI usage

I use three AI tools in this project: Claude in a chat, Claude Code for pull request reviews, and the assistant in the Prisma documentation. A detailed table comes with the final version of this document. In short:

- Tutor and reviewer. I write the application code and the answers above myself. When I am stuck, Claude gives me a complete example in another domain, such as a list of books, and I adapt it. It also reviews what I write and points out gaps, which I fix by hand.
- Set-up and infrastructure, where the assistant wrote the most. It proposed or wrote out the Docker Compose file, the CI workflows, the Prisma schema with the stage enum, the SQL of the two check constraints, the Prisma client set-up file from the Prisma guide, the logger and `instrumentation.ts`. I typed them in, changed what did not fit and ran them.
- Second opinion. I asked the assistant in the Prisma documentation about check constraints and about each version of my schema.
- Documents. Claude drafts the README and the notes in this file, and I review them. The four answers under "Before coding" are mine.
- Pull request review. Claude Code reviews every pull request automatically. The review is advisory: I read it and write any fix by hand.

How I check the results: every change goes through the lint, the type check, the unit tests and the production build in the CI workflow, and I check the behaviour by hand in the browser and in the database. That is how a wrong suggestion was caught: an optional logging setting for Prisma made Next.js report an error while it prerendered the page, so I removed it.
