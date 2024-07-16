# Blog Editor
This is a simple blog editor that allows you to write and publish blog posts. It is built using Vue.js 3 in front-end and Node.js in back-end.

## Features
- Write and publish blog posts
- Edit and delete blog posts
- View all blog posts
- View a single blog post
- Edit user profile
- View user profile
- Authentication


## Technologies
- Vue.js 3
- Node.js
- Express.js
- Sequelize
- MySQL
- JWT
- Bcrypt

## Installation
1. Clone the repository
2. Launch Mysql server with docker-compose
```bash
cd launcher
sh compose.sh
```
3. Install dependencies
```bash
cd front
pnpm install
cd ../api
pnpm install
```
4. Start the server
```bash
cd api
pnpm start
```
5. Start the front-end
```bash
cd front
pnpm run dev
```