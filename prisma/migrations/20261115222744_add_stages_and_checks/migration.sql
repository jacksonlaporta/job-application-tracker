-- Check constraints. The Prisma schema cannot express them.
ALTER TABLE "Application"
  ADD CONSTRAINT "application_title_check" CHECK (trim("title") <> ''),
  ADD CONSTRAINT "application_company_check" CHECK (trim("company") <> '');