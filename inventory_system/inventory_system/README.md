# Relational Inventory Control & Stock Tracking System

## How to Run the Project

1. **Install XAMPP**: Download and install XAMPP from [apachefriends.org](https://www.apachefriends.org/).
2. **Move Files**: Copy the `inventory_system` folder to `C:\xampp\htdocs\`.
3. **Start Services**: Open the XAMPP Control Panel and start **Apache** and **MySQL**.
4. **Setup Database**:
   - Go to `http://localhost/phpmyadmin/`.
   - Create a new database named `inventory_db`.
   - Click the **SQL** tab and paste the code from the "Database Schema" section provided by the instructor.
5. **Access the App**: Open your browser and go to `http://localhost/inventory_system/login.php`.
6. **Login Credentials**:
   - **Username**: `admin`
   - **Password**: `admin123`

## Key Parts of the Code

- **`config/db.php`**: This file uses the `mysqli` extension to connect PHP to your MySQL database. It's the "bridge" between the code and the data.
- **`includes/header.php`**: Contains the sidebar navigation. We include this in every page so we don't have to rewrite the menu code multiple times (DRY principle: Don't Repeat Yourself).
- **`login.php`**: Uses `session_start()` to keep the user logged in. Without sessions, the website would "forget" who you are as soon as you clicked a link.
- **`products.php`**: Demonstrates **CRUD** (Create, Read, Update, Delete). You can add products and delete them.
- **`update_stock.php`**: This is the "Relational" part. When you update stock, it changes the `quantity` in the `products` table AND adds a record to the `stock_transactions` table.
