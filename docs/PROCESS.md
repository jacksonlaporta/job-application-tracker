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