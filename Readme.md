# 🍔 FoodyDoo - Food Delivery Platform

A full-stack MERN food delivery application with integrated Razorpay payment gateway, featuring user authentication,Screen responsive, cart management, and a comprehensive admin panel.

## 🌟 Features

### User Features
- 🔐 User authentication with JWT
- 🛒 Shopping cart with real-time updates
- 🍕 Browse food items by category
- 💳 Multiple payment options (Razorpay, Cash on Delivery)
- 📦 Order tracking and history
- 📱 Fully responsive design

### Admin Panel Features
- ➕ Add new food items with images
- 📋 List and manage all food items
- 📦 Orders management dashboard
- ✅ Update order status in real-time
- 🔄 View all customer orders

### Payment Integration
- 💰 Razorpay payment gateway
- 💵 UPI, Cards, Net Banking support
- 💸 Cash on Delivery option
- 🔒 Secure payment verification

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router
- Axios
- CSS3

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Authentication & Security:**
- JSON Web Tokens (JWT)
- Bcrypt for password hashing

**Payment Gateway:**
- Razorpay API

## 📁 Project Structure

```
FoodyDoo/
├── admin/          # Admin panel for managing food items and orders
├── backend/        # Node.js + Express API server
└── frontend/       # React user interface
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Razorpay Account (for payment integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/khuloodrizwan/FoodyDoo.git
   cd FoodyDoo
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create `.env` file in backend folder**
   ```env
   JWT_SECRET="your_jwt_secret"
   RAZORPAY_KEY_ID="your_razorpay_key_id"
   RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
   MONGODB_URI="your_mongodb_connection_string"
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Admin Panel Setup**
   ```bash
   cd ../admin
   npm install
   ```

6. **Start the Application**

   **Backend** (from backend folder):
   ```bash
   node server.js
   ```

   **Frontend** (from frontend folder):
   ```bash
   npm run dev
   ```

   **Admin Panel** (from admin folder):
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Admin Panel: `http://localhost:4000` 
   - Backend API: `http://localhost:4000`

## 🔑 Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `JWT_SECRET` | Secret key for JWT token generation |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API Key Secret |
| `MONGODB_URI` | MongoDB connection string |

## 💳 Razorpay Integration

### Test Mode
For testing, use these credentials in Razorpay checkout:
- UPI ID: `success@razorpay` (for successful payment)
- UPI ID: `failure@razorpay` (for failed payment)

### Live Mode
1. Complete KYC verification on Razorpay Dashboard
2. Switch to Live Mode
3. Generate Live API Keys
4. Update `.env` with live credentials

## 📸 Screenshots

![alt text](<screenshot/Screenshot 2025-12-14 092624.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092231.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092251.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092309.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092408.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092436.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092459.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092521.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092534.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092600.png>) ![alt text](<screenshot/Screenshot 2025-12-14 092610.png>)![alt text](<screenshot/Screenshot 2025-12-14 093109.png>) ![alt text](<screenshot/Screenshot 2025-12-14 093047.png>) ![alt text](<screenshot/Screenshot 2025-12-14 093056.png>)

## 🔐 Security Features

- Password hashing with Bcrypt
- JWT-based authentication
- Secure payment verification with Razorpay signature
- Environment variables for sensitive data
- Protected API routes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Khulood Rizwan**
- GitHub: [@khuloodrizwan](https://github.com/khuloodrizwan)

## 🙏 Acknowledgments

- Razorpay for payment gateway integration
- MongoDB Atlas for database hosting
- React community for excellent documentation

---

⭐ If you found this project helpful, please give it a star!