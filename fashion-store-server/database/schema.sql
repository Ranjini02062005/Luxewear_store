CREATE DATABASE IF NOT EXISTS fashion_store;
USE fashion_store;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  image_url VARCHAR(255),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending','processing','shipped','delivered') DEFAULT 'pending',
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Sample products
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
('Classic White Shirt', 'Premium cotton formal shirt', 899.00, 'Men', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', 50),
('Floral Summer Dress', 'Light breezy floral print dress', 1299.00, 'Women', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 30),
('Slim Fit Jeans', 'Dark blue stretch denim jeans', 1599.00, 'Men', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 40),
('Casual Kurti', 'Cotton printed daily wear kurti', 699.00, 'Women', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', 60),
('Sports Sneakers', 'Lightweight running shoes', 2499.00, 'Footwear', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 25),
('Leather Handbag', 'Genuine leather shoulder bag', 3299.00, 'Accessories', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', 15),
('Denim Jacket', 'Classic blue denim jacket', 1899.00, 'Men', 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=400', 20),
('Maxi Skirt', 'Bohemian flowy maxi skirt', 999.00, 'Women', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400', 35);