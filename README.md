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

---

## 🧑‍💻 Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, Mongoose (MongoDB)
- **Authentication**: NextAuth.js (Google OAuth)
- **Database**: MongoDB Atlas (or local MongoDB)
- **AI (Optional)**: OpenAI API for smart messaging/scheduling

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
