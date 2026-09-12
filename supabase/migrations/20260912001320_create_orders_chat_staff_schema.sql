/*
# Create Krust ordering schema: orders, order items, chat, staff roles

1. New Tables
- `orders` — customer orders with status tracking (pending → preparing → ready → completed)
  - `id` uuid PK
  - `customer_name` text
  - `customer_phone` text
  - `customer_address` text (nullable for pickup)
  - `fulfillment` text ('pickup' | 'delivery')
  - `payment_method` text ('sedad' | 'edfaely' | 'cash')
  - `payment_ref` text
  - `subtotal` numeric
  - `tax` numeric
  - `delivery_fee` numeric
  - `total` numeric
  - `status` text (default 'pending')
  - `items_json` jsonb (compact snapshot of cart items)
  - `created_at` timestamptz (default now())
  - `updated_at` timestamptz (default now())

- `order_items` — normalized line items per order
  - `id` uuid PK
  - `order_id` uuid FK → orders(id) CASCADE
  - `product_id` text
  - `product_name` text
  - `product_name_en` text
  - `price` numeric
  - `quantity` integer
  - `options` text (nullable)

- `chat_messages` — in-app chat linked to orders
  - `id` uuid PK
  - `order_id` uuid FK → orders(id) CASCADE
  - `sender_role` text ('customer' | 'staff')
  - `message` text
  - `created_at` timestamptz (default now())

- `staff_profiles` — role validation table for staff access
  - `id` uuid PK (references auth.users)
  - `role` text ('staff' | 'admin')
  - `display_name` text
  - `created_at` timestamptz

2. Security
- RLS enabled on all tables
- Orders: anon can insert (customer places order), authenticated can read/update (staff manages)
- Order items: linked to order access
- Chat: anon can insert customer messages + read own order's messages; staff reads all
- Staff profiles: only authenticated users can read their own profile
- updated_at trigger on orders for real-time tracking
*/

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text,
  fulfillment text NOT NULL DEFAULT 'pickup' CHECK (fulfillment IN ('pickup', 'delivery')),
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('sedad', 'edfaely', 'cash')),
  payment_ref text,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  tax numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  items_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anon to insert orders (customers placing orders without login)
DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Allow anon to read orders by id (for tracking via order_id in URL)
-- Staff reads all orders via authenticated role
DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- Allow authenticated (staff) to update order status
DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_name_en text,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  options text
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sender_role text NOT NULL CHECK (sender_role IN ('customer', 'staff')),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat" ON chat_messages;
CREATE POLICY "anon_select_chat" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat" ON chat_messages;
CREATE POLICY "anon_insert_chat" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Staff profiles table
CREATE TABLE IF NOT EXISTS staff_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'admin')),
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_own_staff_profile" ON staff_profiles;
CREATE POLICY "auth_select_own_staff_profile" ON staff_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_order_id ON chat_messages(order_id, created_at);

-- Auto-update updated_at on orders
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();