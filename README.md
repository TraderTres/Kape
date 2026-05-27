# Kape — Philippine Coffee Subscription

A direct-to-consumer specialty coffee subscription platform with a gamified loyalty system.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Prisma ORM
- **Language**: TypeScript (strict)
- **Auth**: NextAuth v5

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Demo Accounts

After seeding:
- **User**: `user@kape.ph` / `password123`
- **Admin**: `admin@kape.ph` / `admin123`