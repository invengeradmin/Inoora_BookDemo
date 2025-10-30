-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  timezone VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create demo_sessions table
CREATE TABLE IF NOT EXISTS demo_sessions (
  id VARCHAR(50) PRIMARY KEY,
  agent_id UUID REFERENCES agents(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_country VARCHAR(100) NOT NULL,
  customer_company VARCHAR(255) NOT NULL,
  demo_date DATE NOT NULL,
  demo_time VARCHAR(10) NOT NULL,
  duration INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'rescheduled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_config table
CREATE TABLE IF NOT EXISTS email_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  smtp_host VARCHAR(255) NOT NULL,
  smtp_port INTEGER NOT NULL,
  smtp_user VARCHAR(255) NOT NULL,
  smtp_password VARCHAR(255) NOT NULL,
  from_email VARCHAR(255) NOT NULL,
  from_name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default agents
INSERT INTO agents (email, name, title, timezone) VALUES
('sarah.johnson@inoora.com', 'Sarah Johnson', 'Senior Sales Manager', 'America/New_York'),
('michael.chen@inoora.com', 'Michael Chen', 'Product Specialist', 'America/Los_Angeles'),
('emma.wilson@inoora.com', 'Emma Wilson', 'Customer Success Lead', 'Europe/London')
ON CONFLICT (email) DO NOTHING;
