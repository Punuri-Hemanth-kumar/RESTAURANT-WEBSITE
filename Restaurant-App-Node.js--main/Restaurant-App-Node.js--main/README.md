# 🍽️ Mini Restaurant Web App

A full-stack restaurant web application built with **Node.js**, **Express**, **MongoDB**, and **EJS**. It supports user registration, login, food ordering, and an admin dashboard to manage orders in real time.

---

## 🚀 Features

- 🔐 **User Authentication** (JWT-based)
- 📋 **Dynamic Menu Display** (Biryani, Meals, Starters, etc.)
- 🛒 **Place Orders** with item tracking
- 👨‍🍳 **Admin Dashboard** to view and auto-complete orders
- 📦 **MongoDB Integration** for storing users, orders, and menu
- 📄 **EJS Templating** for frontend rendering
- 📱 **Responsive UI** with clean design

---

## 🛠️ Tech Stack

| Layer     | Tech                          |
|-----------|-------------------------------|
| Backend   | Node.js, Express              |
| Frontend  | EJS, HTML, CSS, JavaScript    |
| Database  | MongoDB + Mongoose            |
| Auth      | JWT (JSON Web Token)          |
| Dev Tools | Nodemon, Dotenv, bcrypt       |

---

## 📁 Folder Structure

.
├── app.js
├── routes/
│ └── userRoutes.js
├── models/
│ ├── user.js
│ ├── order.js
│ └── menu.js
├── controllers/
│ └── control.js
├── middleware/
│ └── authentication.js
├── views/
│ ├── index.ejs
│ ├── menu.ejs
│ └── typesBiryani.ejs
│ └── adminDashboard.ejs
├── public/
│ └── styles.css
├── .env
└── README.md



