This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First a Postgres database will need to be created and the connection information stored in environment variables. The script to create the tables can be found in `sql/create-tables.sql`. Next.js provides built in environment variable support using a `.env.local` file. Please store the following in it:

```
PGUSER=user_to_connect
PGPASSWORD=password_for_above_user
PGHOST=hostname_of_postgresql_instance
PGDATABASE=databse_name
PGPORT=5432 (or whatver port you choose)
```

Once this is done, run the development server.

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

This project is also deployed on Vercel and can be found at [https://battleship.matt-a-t.vercel.app/](https://battleship.matt-a-t.vercel.app/)