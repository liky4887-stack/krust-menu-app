-- Enable uuid-ossp extension (pgcrypto provides gen_random_uuid)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Customers table (for customer profiles, optional but requested)
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
-- Allow anyone to insert (e.g., during checkout)
CREATE POLICY "customers_insert_anon" ON public.customers
  FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Allow authenticated users to read their own profiles (if we had user linkage)
-- For simplicity, allow authenticated to read all (since no user_id)
CREATE POLICY "customers_select_auth" ON public.customers
  FOR SELECT TO authenticated USING (true);
-- Allow authenticated to update
CREATE POLICY "customers_update_auth" ON public.customers
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Indexes for customers
CREATE INDEX IF NOT EXISTS idx_customers_phone ON public.customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers(created_at DESC);

-- Orders table (matches the schema used in useOrdersStore.ts)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text NOT NULL CHECK (payment_method IN ('sedad', 'edfaely', 'cash')),
  fulfillment_type text NOT NULL CHECK (fulfillment_type IN ('pickup', 'delivery')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- Allow anyone to insert orders (e.g., during checkout)
CREATE POLICY "orders_insert_anon" ON public.orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Allow anyone to read orders (for simplicity; in production you'd restrict by user)
CREATE POLICY "orders_select_anon" ON public.orders
  FOR SELECT TO anon, authenticated USING (true);
-- Allow authenticated to update order status (e.g., staff)
CREATE POLICY "orders_update_auth" ON public.orders
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Staff table (for staff profiles, references auth.users)
CREATE TABLE IF NOT EXISTS public.staff (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'staff' CHECK (role IN ('staff', 'admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
-- Staff can read their own profile
CREATE POLICY "staff_select_own" ON public.staff
  FOR SELECT TO authenticated USING (auth.uid() = id);
-- Staff can insert/update their own profile (if needed)
CREATE POLICY "staff_upsert_own" ON public.staff
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "staff_update_own" ON public.staff
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Indexes for staff
CREATE INDEX IF NOT EXISTS idx_staff_email ON public.staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_role ON public.staff(role);

-- Chat messages table (used by messages tab)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_role text NOT NULL CHECK (sender_role IN ('customer', 'staff')),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
-- Allow anyone to read/insert chat messages (for simplicity)
CREATE POLICY "chat_select_anon" ON public.chat_messages
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "chat_insert_anon" ON public.chat_messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Index for chat_messages
CREATE INDEX IF NOT EXISTS idx_chat_messages_order_id ON public.chat_messages(order_id, created_at);
