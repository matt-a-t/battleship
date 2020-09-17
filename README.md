This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

You will also need to build the sqlite3 database
```bash
npm run sql
# or
yarn sql
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

While there is currently a version that is deployed on Vercel, there seems to be an [issue with SQLite3 databases on the platform](https://github.com/vercel/vercel/discussions/4443). I will be updating the project to use a different database solution, but for now the deployed version is not working.
