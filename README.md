# E-Store – Full Stack E-Commerce Application

A full-stack e-commerce web application built using **Angular, Node.js, Express.js, and MySQL**. The application provides an online shopping experience with product management, user authentication, order processing, and secure online payments using Razorpay.

## 🚀 Features

- **User Authentication:** User registration and login.
- **Product Management:** Browse and retrieve products.
- **Category Management:** Organize products by categories.
- **Shopping and Checkout:** Process customer orders.
- **Order Management:** Store and manage customer orders.
- **Razorpay Integration:** Online payment processing.
- **Payment Verification:** Verify Razorpay payment signatures on the backend.
- **MySQL Database:** Relational data storage.
- **RESTful APIs:** Backend API development using Express.js.
- **Cloud Deployment:** Backend hosted on Render.

## 🛠️ Technology Stack

| Technology | Purpose                   |
| ---------- | ------------------------- |
| Angular    | Frontend development      |
| TypeScript | Frontend programming      |
| Node.js    | Backend runtime           |
| Express.js | REST API development      |
| MySQL      | Relational database       |
| mysql2     | MySQL connectivity        |
| Razorpay   | Payment gateway           |
| dotenv     | Environment configuration |
| Render     | Backend deployment        |

## 🏗️ Application Architecture

```text
Angular Frontend
       |
       | HTTP Requests
       v
Node.js + Express.js Backend
       |
       |-------------------|
       |                   |
       v                   v
   MySQL Database      Razorpay API
       |                   |
       |                   |
       v                   v
 Users, Products,      Payment
 Categories, Orders    Verification
```

## 📂 Database Structure

The application uses MySQL with relational tables.

| Table        | Description                                                               |
| ------------ | ------------------------------------------------------------------------- |
| users        | Stores customer information                                               |
| products     | Stores product details                                                    |
| orders       | Stores customer orders and delivery information                           |
| orderdetails | Stores individual products, quantities, prices, and amounts within orders |

The order details are associated with orders and products through relational keys.

## 💳 Razorpay Payment Integration

The application integrates Razorpay to process online payments.

### Payment Flow

1. Customer proceeds to checkout.
2. Angular sends a payment request to the backend.
3. Backend calculates the order total using trusted database values.
4. Backend creates a Razorpay order.
5. Razorpay Checkout opens on the frontend.
6. Customer completes the payment.
7. Frontend sends payment details to the backend.
8. Backend verifies the Razorpay payment signature.
9. Payment and order status are updated in MySQL.

### Payment API Endpoints

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| POST   | `/api/payment/create-order` | Create a Razorpay order |
| POST   | `/api/payment/verify`       | Verify payment details  |

**Security:** Razorpay Key Secret must remain on the backend. Only the Razorpay Key ID should be exposed to the frontend.

## 🌐 Backend Deployment

The Node.js backend is deployed using Render.

**Production API URL:**

https://angular-node-mysql-ecommerce.onrender.com

The backend uses environment variables for database configuration, application port, and payment gateway credentials.

## ⚙️ Installation and Setup

### 1. Clone Repository

```bash
git clone https://github.com/Faisal-Usmani/angular-node-mysql-ecommerce.git

cd angular-node-mysql-ecommerce
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd estore_API
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=estore

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Configure the environment variables according to your local database and Razorpay account.

### 3. Database Setup

Create the MySQL database:

```sql
CREATE DATABASE estore;
```

Import your project database schema and data into the `estore` database.

### 4. Start Backend

```bash
npm start
```

The backend runs locally at:

```text
http://localhost:5001
```

### 5. Frontend Setup

Navigate to the Angular frontend directory:

```bash
npm install
```

Start the Angular application:

```bash
ng serve
```

Open:

```text
http://localhost:4200
```

## 🔐 Environment Variables and Security

- Keep database credentials inside `.env`.
- Never commit `.env` files to GitHub.
- Keep Razorpay Key Secret on the backend.
- Validate payment signatures on the server.
- Calculate order totals using backend/database values.
- Configure the frontend API URL for the appropriate environment.

## 🚀 Deployment

### Frontend

Build the Angular application:

```bash
ng build
```

Deploy the generated production build using your chosen frontend hosting provider.

### Backend

Deploy the Node.js backend through Render.

Configure the required environment variables in the Render dashboard, including:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

Ensure the backend listens on the port provided by `process.env.PORT`.

## 📚 Learning Outcomes

This project demonstrates practical experience with:

- Full-stack development using Angular and Node.js.
- REST API development using Express.js.
- Relational database design using MySQL.
- Database relationships and SQL queries.
- Authentication and user management.
- E-commerce order processing.
- Third-party payment gateway integration.
- Razorpay order creation and payment verification.
- Environment configuration and cloud deployment.

## 👨‍💻 Author

**Mohammed Faisal Usmani**

- GitHub: [Faisal-Usmani](https://github.com/Faisal-Usmani)
- LinkedIn: [Mohammed Faisal Usmani](https://www.linkedin.com/in/mohammed-faisal-usmani-4ba00320b/)

---

⭐ If you find this project useful, consider giving it a star!
