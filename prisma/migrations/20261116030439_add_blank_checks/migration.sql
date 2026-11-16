-- Check constraints. The Prisma 7 schema cannot express them.
-- A title or a company must contain at least one character that is not white space.
ALTER TABLE "applications"
  ADD CONSTRAINT "application_title_check" CHECK ("title" ~ '\S'),
  ADD CONSTRAINT "application_company_check" CHECK ("company" ~ '\S');
