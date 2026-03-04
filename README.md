# Blog API

Complete RESTful Blog API with **user authentication**, **JWT tokens**, **token blacklisting**, **admin privileges**, blog posts, and categories. Built with Node.js, Express & MongoDB.

## Features
- User registration & login (JWT)
- Token blacklisting (logout support)
- Protected routes + admin-only endpoints
- CRUD for posts & categories
- MongoDB with Mongoose

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- Token blacklist model
- dotenv

## Important Environment Variables (.env)
PORT=8000
MONGODB_URI=mongodb://localhost:27017/blog_db
JWT_SECRET=super_long_random_secret_here_change_this


## API Base: `http://localhost:8000`

**Auth Routes**  
- POST `/auth/register`  
- POST `/auth/login`  
- POST `/auth/logout` (blacklist token – assumed)

**Protected Routes** (use `Authorization: Bearer <token>`)  
- User: `/user/...`  
- Posts: `/post/...` (create/update/delete usually protected)  
- Categories: `/categories/...` (some admin-only)

**Admin Guard**  
Applied via `authAdmin` middleware on routes that need admin rights.

## Setup
1. Clone repo  
2. `npm install`  
3. Create `.env` with values above  
4. `npm start` or `node server.js`

## Security Notes
- Never expose `JWT_SECRET`
- Add HTTPS in production
- Consider rate limiting on login/auth routes
- Validate inputs (Joi/Zod recommended)

