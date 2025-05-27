# 🚗 Car Rental System

A full-stack web-based Car Rental System that allows customers to browse, reserve, and manage rental vehicles, while providing admins with tools to manage cars and reservations.

Built with:
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Frontend:** React.js
- **Authentication:** JWT with Role-Based Access Control (RBAC)

---

## 📁 Folder Structure

```
car-rental-system/
├── backend/             # Node.js API
│   ├── config/          # DB config (not tracked)
│   ├── middleware/      # Auth middleware
│   ├── routes/          # Auth, admin, customer APIs
│   └── server.js        # Express entry point
├── frontend/            # React frontend
│   └── src/             # React components & pages
├── .gitignore
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js (v18+)
- MySQL (Workbench or XAMPP)
- npm
- `cloudflare` (optional, for public access)

---

## 🛠️ How to Run the Project Locally

### 1. **Clone the Repo**
```bash
git clone https://github.com/Kn0cKOuT/car-rental-system.git
cd car-rental-system
```

---

### 2. **Set Up the Backend**

#### ⚙️ Navigate to backend
```bash
cd backend
```

#### 📦 Install dependencies
```bash
npm install
```

#### 🗄️ Create `.env` file
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=car_rental_db
JWT_SECRET=yourjwtsecret
```

#### 🛢️ Set up your MySQL database
- Create a database named `car_rental_db`
- Import your schema (SQL file, if available)

#### ▶️ Run the backend server
```bash
node server.js
```
It should say: `Server running on http://localhost:3001`

---

### 3. **Set Up the Frontend**

#### ⚙️ Navigate to frontend
```bash
cd ../frontend
```

#### 📦 Install dependencies
```bash
npm install
```

#### ▶️ Start the React app
```bash
npm start
```
It will run on: `http://localhost:3000`

---

### 4. **Optional: Make Backend Public with ngrok**
```bash
ngrok http 3001
```

Use the generated HTTPS URL in your frontend `api.ts` config to allow real-world testing.

---

## 🔐 Roles and Authentication

- JWT tokens are issued upon login
- Admin and Customer dashboards are role-protected
- Tokens must be included in the `Authorization` header as `Bearer <token>`

---

## ✅ Features

- Admin:
  - Add/delete cars
  - View all reservations
- Customer:
  - Browse available cars
  - Make and manage reservations
- Secure login & registration
- Input validation and error handling

---

## 📌 Notes

- Ensure MySQL is running (via Workbench or XAMPP)
- Compatible with free deployment via cloudflare or VPS

---

## 📧 Contact

For feedback or issues, please open an issue or contact [@Kn0cKOuT](https://github.com/Kn0cKOuT).
