@AGENTS.md

## Code review

This is a learning project. The author writes all application code by hand.

- Report correctness problems: bugs, missing validation, unhandled errors, and behaviour that contradicts `README.md` or the documents in `docs/`.
- Explain what is wrong and why it matters. Do not write the corrected code.
- Skip formatting and style comments. ESLint covers those.
- The project uses Prisma ORM 7. Before commenting on database code, consult the Prisma skills in `.claude/skills`, and do not suggest patterns from older or newer Prisma versions.
- The project uses Prisma ORM 7.10. Its CLI reads `prisma7.config.ts`, the config file name from version 7.10 on, and finds it without a `--config` flag. `prisma.config.ts` is the name used by Prisma ORM 8 and by releases before 7.10.
- `infra/` is a separate AWS CDK app with its own `package.json`. The root type check, lint and tests leave it out.
- Write in British English.
