USE fashion_store;

-- ── Step 1: Add sub_category column to products table ──
ALTER TABLE products ADD COLUMN IF NOT EXISTS sub_category VARCHAR(60) DEFAULT NULL;

-- ── Step 2: Update existing Men products with sub_category ──
UPDATE products SET sub_category = 'Men' WHERE category = 'Men' AND sub_category IS NULL;
UPDATE products SET sub_category = 'Women' WHERE category = 'Women' AND sub_category IS NULL;
UPDATE products SET sub_category = 'Footwear' WHERE category = 'Footwear' AND sub_category IS NULL;
UPDATE products SET sub_category = 'Accessories' WHERE category = 'Accessories' AND sub_category IS NULL;
UPDATE products SET sub_category = 'Cosmetics' WHERE category = 'Cosmetics' AND sub_category IS NULL;

-- ── Step 3: Insert Men sub-category products ──

-- KIDS (0-5 years)
INSERT INTO products (name, description, price, category, sub_category, image_url, stock) VALUES
('Baby Romper Set', 'Soft cotton full body romper for babies 0-2 years, comfortable and washable', 299.00, 'Men', 'Kids', 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400', 60),
('Infant Dungaree', 'Cute denim dungaree for toddlers with snap buttons for easy dressing', 449.00, 'Men', 'Kids', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400', 55),
('Baby T-Shirt Pack', 'Pack of 3 soft cotton t-shirts for babies, multiple color options', 399.00, 'Men', 'Kids', 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400', 70),
('Newborn Gift Set', 'Complete clothing set for newborns including onesie, cap, socks and mittens', 699.00, 'Men', 'Kids', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 40),

-- CHILDREN (6-12 years)
INSERT INTO products (name, description, price, category, sub_category, image_url, stock) VALUES
('Boys Casual T-Shirt', 'Trendy graphic printed t-shirt for boys aged 6-12 years, 100% cotton', 349.00, 'Men', 'Children', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400', 65),
('Boys Denim Shorts', 'Comfortable denim shorts for boys with elastic waistband and pockets', 499.00, 'Men', 'Children', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', 50),
('School Formal Shirt', 'White and light blue formal shirts for school boys, wrinkle-resistant', 399.00, 'Men', 'Children', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', 80),
('Boys Track Suit', 'Sporty polyester track suit for active boys, great for school sports', 799.00, 'Men', 'Children', 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400', 45),
('Boys Ethnic Kurta', 'Traditional cotton kurta for festivals and special occasions', 599.00, 'Men', 'Children', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', 35),

-- JEANS (All age denim)
INSERT INTO products (name, description, price, category, sub_category, image_url, stock) VALUES
('Classic Slim Fit Jeans', 'Dark blue stretch denim slim fit jeans for men, comfortable all day', 1299.00, 'Men', 'Jeans', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 55),
('Skinny Ripped Jeans', 'Trendy ripped skinny jeans with distressed details, street style look', 1499.00, 'Men', 'Jeans', 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400', 40),
('Relaxed Fit Jeans', 'Comfortable relaxed fit jeans for casual everyday wear, mid-rise waist', 1199.00, 'Men', 'Jeans', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 45),
('Boys Slim Jeans', 'Slim fit jeans for teenage boys, stretchable and durable denim', 799.00, 'Men', 'Jeans', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', 50),
('Black Skinny Jeans', 'All-black skinny jeans for a sharp modern look, ideal for outings', 1399.00, 'Men', 'Jeans', 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400', 38),

-- MEN (Adult formal + casual)
INSERT INTO products (name, description, price, category, sub_category, image_url, stock) VALUES
('Oxford Formal Shirt', 'Premium cotton oxford button-down formal shirt for office wear', 999.00, 'Men', 'Men', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', 50),
('Linen Casual Shirt', 'Breathable linen shirt for summer, perfect for casual outings', 1199.00, 'Men', 'Men', 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400', 40),
('Polo T-Shirt', 'Classic polo collar t-shirt in premium cotton pique fabric', 699.00, 'Men', 'Men', 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400', 60),
('Formal Blazer', 'Single-breasted tailored blazer for meetings and formal events', 3499.00, 'Men', 'Men', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400', 20),
('Men Kurta Pyjama', 'Cotton kurta pyjama set for festivals and traditional occasions', 1299.00, 'Men', 'Men', 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400', 35),
('Cargo Trousers', 'Multi-pocket cargo trousers in olive and khaki, casual style', 1099.00, 'Men', 'Men', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', 45),

-- TEENS (13-18 years)
INSERT INTO products (name, description, price, category, sub_category, image_url, stock) VALUES
('Teen Graphic Hoodie', 'Cool graphic printed hoodie for teenagers, fleece lining inside', 899.00, 'Men', 'Teens', 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400', 55),
('Teen Jogger Pants', 'Comfortable cotton jogger pants with drawstring, perfect for teens', 699.00, 'Men', 'Teens', 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400', 50),
('Oversized Tee', 'Trendy oversized drop-shoulder t-shirt for teenage street style', 549.00, 'Men', 'Teens', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400', 65),
('Teen Denim Jacket', 'Classic denim jacket for teenagers, goes with everything', 1299.00, 'Men', 'Teens', 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=400', 30);

-- ── Step 4: Verify ──
SELECT sub_category, COUNT(*) as count 
FROM products 
WHERE category = 'Men' 
GROUP BY sub_category 
ORDER BY sub_category;