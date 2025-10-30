-- Fix the database schema and ensure all tables exist properly

-- 1. Create agents table with proper structure
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  timezone VARCHAR(100) NOT NULL DEFAULT 'America/New_York',
  is_active BOOLEAN DEFAULT true,
  role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('agent', 'super_admin')),
  password_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create demo_sessions table with proper structure
CREATE TABLE IF NOT EXISTS demo_sessions (
  id VARCHAR(50) PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_country VARCHAR(100) NOT NULL,
  customer_company VARCHAR(255) NOT NULL,
  customer_timezone VARCHAR(100),
  demo_date DATE NOT NULL,
  demo_time VARCHAR(10) NOT NULL,
  duration INTEGER NOT NULL DEFAULT 30,
  status VARCHAR(30) DEFAULT 'pending_assignment' CHECK (status IN (
    'pending_assignment', 'confirmed', 'cancelled', 'rescheduled', 'completed', 
    'success_pending', 'on_hold_waiting', 'regret', 'interested', 
    'need_in_depth_demo', 'onboard'
  )),
  notes TEXT,
  assigned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create blocked_slots table
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  reason VARCHAR(255),
  blocked_by UUID REFERENCES agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, time)
);

-- 4. Create email_config table
CREATE TABLE IF NOT EXISTS email_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  smtp_host VARCHAR(255) NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_user VARCHAR(255) NOT NULL,
  smtp_password VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create email_logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(50) REFERENCES demo_sessions(id),
  from_email VARCHAR(255) NOT NULL,
  to_email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_by UUID REFERENCES agents(id)
);

-- 6. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_demo_sessions_date_time ON demo_sessions(demo_date, demo_time);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_agent ON demo_sessions(agent_id);
CREATE INDEX IF NOT EXISTS idx_demo_sessions_status ON demo_sessions(status);
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date_time ON blocked_slots(date, time);
CREATE INDEX IF NOT EXISTS idx_email_logs_session ON email_logs(session_id);

-- 7. Insert default agents with proper credentials
INSERT INTO agents (email, name, title, timezone, role, is_active, password_hash) VALUES
('info@inoora.ai', 'Super Admin', 'System Administrator', 'UTC', 'super_admin', true, 'Invenger@123'),
('benjamin.macklin@invenger.com', 'Benjamin Macklin', 'Sales Executive', 'America/New_York', 'agent', true, 'Invenger@123'),
('sarah.johnson@inoora.com', 'Sarah Johnson', 'Senior Sales Manager', 'America/New_York', 'agent', true, 'demo123'),
('michael.chen@inoora.com', 'Michael Chen', 'Product Specialist', 'America/Los_Angeles', 'agent', true, 'demo123'),
('emma.wilson@inoora.com', 'Emma Wilson', 'Customer Success Lead', 'Europe/London', 'agent', true, 'demo123')
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  timezone = EXCLUDED.timezone,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  password_hash = EXCLUDED.password_hash;

-- 8. Create function to ensure single active email config
CREATE OR REPLACE FUNCTION ensure_single_active_config()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_active = true THEN
    UPDATE email_config SET is_active = false WHERE id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger for email config
DROP TRIGGER IF EXISTS ensure_single_active_config_trigger ON email_config;
CREATE TRIGGER ensure_single_active_config_trigger
BEFORE INSERT OR UPDATE ON email_config
FOR EACH ROW
WHEN (NEW.is_active = true)
EXECUTE FUNCTION ensure_single_active_config();
