# Rental Hub - Rental Management System

Rental Hub is a **comprehensive rental management platform** designed to streamline the process of renting items between owners and customers. It supports listing rental products, managing transactions, tracking rental statuses, and maintaining wishlists.

---

## 🚀 Features / USP

- **Multi-user support**: Separate roles for owners and renters.
- **Rental product management**: Add, edit, and remove rental products.
- **Transaction tracking**: End-to-end transaction lifecycle management.
- **Wishlist system**: Customers can save products for later.
- **RESTful API**: Easily integrate with mobile or web clients.
- **Authentication**: Secure login & registration with JWT tokens.
- **Admin Dashboard**: Powerful admin panel to manage users, products, and transactions.

---

## 🛠 Tech Stack

**Backend:** Django, Django REST Framework (DRF)  
**Database:** PostgreSQL / SQLite (for development)  
**Authentication:** JWT (via djangorestframework-simplejwt)  
**Frontend:** (Pluggable - React / Vue / Angular)  
**Deployment:** Docker, Gunicorn, Nginx  

---

## 📂 Project Structure

```
backend/
│
├── rentals/                # App for managing rental products
│   ├── models.py            # RentalProduct model
│   ├── views.py             # Product listing & CRUD APIs
│   ├── serializers.py       # Product serialization
│   └── urls.py              # Product-related endpoints
│
├── transactions/           # App for managing transactions & wishlists
│   ├── models.py            # Transaction & Wishlist models
│   ├── views.py             # Transaction & wishlist APIs
│   ├── serializers.py       # Serialization logic
│   └── urls.py              # Endpoints for transactions & wishlist
│
├── users/                   # Authentication & profile management
│   ├── models.py            # User model (extended from Django User)
│   ├── views.py             # Auth views
│   ├── serializers.py       # User serialization
│   └── urls.py              # Auth endpoints
│
├── backend/                 # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
└── manage.py
```

---

## 📌 API Endpoints

### **Auth**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register/` | Register a new user |
| POST   | `/api/auth/login/`    | Obtain JWT tokens |
| POST   | `/api/auth/logout/`   | Logout user |

### **Rentals**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/rentals/` | List all rental products |
| POST   | `/api/rentals/` | Create a rental product |
| GET    | `/api/rentals/{id}/` | Retrieve product details |
| PUT    | `/api/rentals/{id}/` | Update product |
| DELETE | `/api/rentals/{id}/` | Delete product |

### **Transactions**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/customer/transactions/` | List customer transactions |
| POST   | `/api/customer/transactions/` | Create a transaction |
| GET    | `/api/owner/transactions/` | List owner transactions |

### **Wishlist**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/wishlist/` | List all wishlist items |
| POST   | `/api/wishlist/` | Add a product to wishlist |
| DELETE | `/api/wishlist/{id}/` | Remove product from wishlist |

---

## ⚙️ Installation & Setup

### **Clone the repository**
```bash
git clone https://github.com/yourusername/rental-hub.git
cd rental-hub/backend
```


### **Run the development server**
```bash
sudo docker compose up --build
```

---

## 📜 License
This project is licensed under the **MIT License**.
