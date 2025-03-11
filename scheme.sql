-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Food items table
CREATE TABLE IF NOT EXISTS food_items (
  id SERIAL PRIMARY KEY,
  usda_fdc_id VARCHAR(50) UNIQUE,
  name VARCHAR(255) NOT NULL,
  brand_name VARCHAR(255),
  category VARCHAR(100),
  is_custom BOOLEAN DEFAULT FALSE,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Nutrients table
CREATE TABLE IF NOT EXISTS nutrients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  unit VARCHAR(50) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE
);

-- Food nutrients mapping table
CREATE TABLE IF NOT EXISTS food_nutrients (
  id SERIAL PRIMARY KEY,
  food_item_id INTEGER NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  nutrient_id INTEGER NOT NULL REFERENCES nutrients(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  UNIQUE(food_item_id, nutrient_id)
);

-- User food logs
CREATE TABLE IF NOT EXISTS food_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_item_id INTEGER NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
  serving_size DECIMAL(10, 2) NOT NULL,
  meal_type VARCHAR(50),
  consumed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User nutrition goals
CREATE TABLE IF NOT EXISTS nutrition_goals (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nutrient_id INTEGER NOT NULL REFERENCES nutrients(id) ON DELETE CASCADE,
  target_amount DECIMAL(10, 2) NOT NULL,
  is_minimum BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, nutrient_id)
);

-- Insert primary nutrients
INSERT INTO nutrients (name, unit, is_primary) 
VALUES 
  ('Sugar', 'g', TRUE),
  ('Carbohydrates', 'g', TRUE),
  ('Protein', 'g', TRUE),
  ('Fat', 'g', TRUE),
  ('Fiber', 'g', TRUE),
  ('Sodium', 'mg', TRUE),
  ('Cholesterol', 'mg', FALSE),
  ('Vitamin A', 'IU', FALSE),
  ('Vitamin C', 'mg', FALSE),
  ('Calcium', 'mg', FALSE),
  ('Iron', 'mg', FALSE)
ON CONFLICT (name) DO NOTHING;
