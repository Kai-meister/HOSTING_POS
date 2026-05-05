-- Insert sample categories (only if they don't exist)
MERGE INTO categories (id, name) KEY(name)
VALUES (1, 'Food & Drinks'),
       (2, 'Electronics'),
       (3, 'Clothing');

-- Insert sample products (only if they don't exist)
MERGE INTO products (id, name, price, stock, category_id, description, image_url, active) KEY(name)
VALUES
    (1, 'Burger Combo', 8.99, 50, 1, 'Classic beef burger with fries and drink', NULL, TRUE),
    (2, 'Iced Coffee', 3.49, 100, 1, 'Cold brew iced coffee with milk', NULL, TRUE),
    (3, 'Chicken Sandwich', 7.50, 40, 1, 'Grilled chicken breast on a toasted bun', NULL, TRUE),
    (4, 'Bottled Water', 1.25, 200, 1, '500ml mineral water', NULL, TRUE),
    (5, 'Wireless Earbuds', 49.99, 15, 2, 'Bluetooth 5.0 wireless earbuds', NULL, TRUE),
    (6, 'Phone Case', 12.99, 30, 2, 'Protective silicone phone case', NULL, TRUE),
    (7, 'USB-C Cable', 9.99, 25, 2, '1m fast-charging USB-C cable', NULL, TRUE),
    (8, 'T-Shirt (M)', 14.99, 20, 3, 'Cotton unisex t-shirt, medium size', NULL, TRUE),
    (9, 'Baseball Cap', 19.99, 10, 3, 'Adjustable cotton baseball cap', NULL, TRUE),
    (10, 'Chocolate Bar', 2.50, 3, 1, 'Dark chocolate 70% cocoa, 100g', NULL, TRUE);
