# Treclone — Fullstack Next.js App with Prisma

A professional starter app built with Next.js (App Router), Prisma ORM and PostgreSQL.

This repository demonstrates a production-oriented structure including Prisma schema and migrations, Next.js App Router pages, API routes, server and client components, Tailwind CSS, and testing configuration.

## Features

- Next.js App Router with TypeScript
- Prisma ORM with migrations and seed script
- PostgreSQL-ready configuration (compatible with Prisma Postgres)
- Tailwind CSS for styling
- Authentication and workspace features scaffolded
- Vitest configuration for unit and integration tests

## Tech stack

- Next.js 15 + App Router
- TypeScript
- Prisma ORM
- PostgreSQL (or Prisma Postgres)
- Tailwind CSS
- Vitest for testing

## Requirements

- Node.js 18+ (LTS recommended)
- npm (or pnpm/yarn)
- A PostgreSQL database (or use Prisma Postgres)

## Quickstart

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root and add your `DATABASE_URL`:

```bash
# .env
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>
```

3. Initialize and apply migrations

```bash
npx prisma migrate dev --name init
```

4. Seed the database

```bash
npx prisma db seed
```

5. Run the development server

```bash
npm run dev
```

The app will be available at http://localhost:3000.

## Important files

- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)
- Seed script: [prisma/seed.ts](prisma/seed.ts)
- Next.js App entry: [app/layout.tsx](app/layout.tsx)
- Tailwind config: [tailwind.config.ts](tailwind.config.ts)

## Database & Prisma notes

- To switch databases, update `provider` in `prisma/schema.prisma` and set the appropriate `DATABASE_URL`.
- When collaborating, commit migrations from `prisma/migrations` so teammates and CI can apply the same schema.

Common Prisma commands:

```bash
# Generate Prisma client after editing schema
npx prisma generate

# Apply migrations (development)
npx prisma migrate dev

# Create a migration without applying (deploy workflows may use migrate deploy)
npx prisma migrate diff

# Open Prisma Studio
npx prisma studio
```

## Testing

Run unit and integration tests with Vitest:

```bash
npm run test
```

Adjust test scripts in `package.json` if your workflow differs.

## Building & deployment

Build for production:

```bash
npm run build
npm start
```

This project is ready for deployment to Vercel, Render, or any Node.js host. For Vercel, ensure `DATABASE_URL` is configured in the project environment variables.

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a feature branch
3. Add tests for new behavior
4. Run migrations and seed locally
5. Open a pull request with a clear description

## Troubleshooting

- If Prisma complains about missing client, run `npx prisma generate`.
- If migrations fail, check `prisma/migrations` and the database connection in `.env`.
- For platform-specific issues (Windows), ensure environment variables are loaded correctly and line endings are normalized.

## License & contact

This project is provided as an example. Add a `LICENSE` file to clarify terms for your use.

If you have questions, open an issue or contact the maintainers.

---

Updated README: provides a clear onboarding, setup, and maintenance guide for developers and contributors.
