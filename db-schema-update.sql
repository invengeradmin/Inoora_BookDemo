-- Add super admin role and enhanced session statuses
ALTER TABLE agents ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('agent', 'super_admin'));

-- Update demo_sessions table with new status options and notes
ALTER TABLE demo_sessions DROP CONSTRAINT IF EXISTS demo_sessions_status_check;
ALTER TABLE demo_sessions ADD CONSTRAINT demo_sessions_status_check 
CHECK (status IN ('confirmed', 'cancelled', 'rescheduled', 'completed', 'success_pending', 'on_hold_waiting', 'regret', 'interested', 'need_in_depth_demo', 'onboard'));

-- Add email tracking table
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

-- Update existing agents and add new ones
UPDATE agents SET role = 'super_admin' WHERE email = 'info@inoora.ai';

-- Insert super admin if not exists
INSERT INTO agents (email, name, title, timezone, role) VALUES
('info@inoora.ai', 'Super Admin', 'System Administrator', 'UTC', 'super_admin')
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  role = EXCLUDED.role;

-- Insert new agent
INSERT INTO agents (email, name, title, timezone, role) VALUES
('benjamin.macklin@invenger.com', 'Benjamin Macklin', 'Sales Executive', 'America/New_York', 'agent')
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  role = EXCLUDED.role;
