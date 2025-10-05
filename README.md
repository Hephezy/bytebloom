# 📝 Full-Stack Blog Website (Monorepo)

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-13-black?logo=next.js)
![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey?logo=express)
![GraphQL](https://img.shields.io/badge/GraphQL-API-e10098?logo=graphql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38b2ac?logo=tailwind-css)

A modern full-stack blog application built with a **monorepo architecture**.
The project demonstrates how to build a scalable blog system using **Next.js (TypeScript + TailwindCSS)** for the frontend and **Express.js (TypeScript + GraphQL)** for the backend.

---

## 📌 Features

- **GraphQL API** powered by Apollo Server (queries + mutations)
- **Express.js + TypeScript** backend with JWT authentication
- **Next.js + TypeScript** frontend for fast SSR/SSG rendering
- **TailwindCSS** with dark/light theme toggle
- **Monorepo structure** with `client/` and `server/`
- End-to-end blog features:
  - Create, read, update, and delete posts
  - User authentication (signup, login, JWT)
  - Commenting system
  - Responsive UI with theme switcher

---

## 🛠️ Tech Stack

### **Frontend (client/)**

- [Next.js](https://nextjs.org/) – React framework with SSR & API routes
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [Apollo Client](https://www.apollographql.com/docs/react/) – GraphQL client
- [TailwindCSS](https://tailwindcss.com/) – Utility-first styling
- Theme support (light/dark)

### **Backend (server/)**

- [Express.js](https://expressjs.com/) – Web framework
- [TypeScript](https://www.typescriptlang.org/) – Static typing
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/) – GraphQL API
- [Prisma](https://www.prisma.io/) – Database ORM/ODM
- [JWT](https://jwt.io/) – Authentication

---

## 📂 Project Structure

```bash
├── client/ # Next.js frontend
│ ├── app/
│ ├── components/
│ └── ...
│
├── server/ # Express backend
│ ├── src/
│ │ ├── prisma
│ │ ├── resolvers/
│ │ ├── models/
│ │ └── index.ts
│ └── ...
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🔮 Why GraphQL?

Traditional REST APIs often lead to **over-fetching** or **under-fetching** data.
This project uses **GraphQL** to:

- Define a strict schema (`Post`, `User`, `Comment`) so frontend and backend share the same contract.
- Fetch **only what’s needed** using queries like `getPosts`, `getPostById`, `getUserProfile`.
- Mutate state predictably with operations like `createPost`, `addComment`, `registerUser`.
- Handle **nested data** easily (e.g., fetch a post _with its comments and author_ in one request).

With TypeScript + Apollo Client, the entire flow becomes **type-safe, predictable, and efficient**.

---

## 📜 Example GraphQL Operations

### Query all posts

```graphql
query {
  getPosts {
    id
    title
    content
    author {
      username
    }
  }
}
```

### Create a new post

```graphql
mutation {
  createPost(input: { title: "Hello GraphQL", content: "My first blog post" }) {
    id
    title
  }
}
```

---

## 🚀 Getting Started

### 1️⃣ Clone Repo

```bash
git clone https://github.com/your-username/fullstack-blog-monorepo.git
cd fullstack-blog-monorepo
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run Both Frontend & Backend Together

Thanks to concurrently, you can spin up both services in one command:

```bash
npm run dev
```

Or run separately if needed:

```bash
# Backend
cd server && npm run dev

# Frontend
cd client && npm run dev

```

### 4️⃣ Open in Browser

```bash
Frontend: http://localhost:3000
Backend Playground: http://localhost:4000/graphql
```

## 🌍 Deployment

- **Frontend** → [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/)
- **Backend** → [Render](https://render.com/), [Railway](https://railway.app/), or [Heroku](https://www.heroku.com/)
- **Database** → [PostgreSQL on Supabase](https://supabase.com/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork this repo and submit a PR.

## 📢 Author

Built with ❤️ by Oluwapelumi Martins
Follow me on LinkedIn → [LinkedIn](https://www.linkedin.com/in/pelumi-martins3) for progress updates.
