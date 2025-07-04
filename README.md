# 📊 Mini CRM Platform

A lightweight CRM (Customer Relationship Management) system built with **Next.js**, **Express.js**, **MongoDB**, and **Tailwind CSS**, featuring powerful segmentation, campaign management, order tracking, and Google OAuth authentication.

## 🚀 Features

- **Customer Management**: Import, view, edit, and delete customers with CSV upload support.
- **Order Management**: Track customer orders with CRUD capabilities.
- **Segmentation**: Build dynamic audience segments using advanced filters (AND/OR logic).
- **Campaigns**:
  - Create and send marketing campaigns.
  - Use AI-generated messages (optional enhancement).
  - View delivery statistics and logs (sent/failed).
- **Dashboard**: Visual overview of customers, orders, segments, and campaigns.
- **Google OAuth**: Secure login using Google authentication.

## 🖼️ Screenshots

### Sign in Page  
![Sign in](images\image-2.png)

### Login Page  
![Login](images\image-3.png)

### Dashboard Overview  
![Dashboard](images\image.png)

### Customers Page 
![Customers](images\image-6.png)

### Orders Page 
![Orders](images\image-5.png)

### Segments Page 
![Segments](images\image-4.png)

### Campaign Page 
![Campaign Page](images\image-7.png)

### Campaign Details  
![Campaign Details](images\image-1.png)

---

## 🧑‍💻 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **Authentication**: NextAuth.js (Google OAuth)
- **Database**: MongoDB Atlas (or local MongoDB)

---

## ⚙️ Setup Instructions

### Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)
- Google OAuth Credentials (Client ID & Secret)

### 1. Clone the Repository

```bash
git clone https://github.com/gurleenkaur0703/mini-crm.git
cd mini-crm
```

### 2. Setup Backend

```bash
cd backend
npm install
# Create a .env file with MONGODB_URI
node index.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
# Create .env.local for NextAuth config
npm run dev
```
