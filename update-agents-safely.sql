-- Add role column to agents table if it doesn't exist
ALTER TABLE agents ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('agent', 'super_admin'));

-- Update existing agents to have agent role and deactivate them
UPDATE agents SET role = 'agent', is_active = false WHERE role IS NULL OR role = 'agent';

-- Insert super admin (or update if exists)
INSERT INTO agents (email, name, title, timezone, role, is_active) VALUES
('info@inoora.ai', 'Super Admin', 'System Administrator', 'UTC', 'super_admin', true)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  timezone = EXCLUDED.timezone,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Insert agent (or update if exists)
INSERT INTO agents (email, name, title, timezone, role, is_active) VALUES
('benjamin.macklin@invenger.com', 'Benjamin Macklin', 'Sales Executive', 'America/New_York', 'agent', true)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  timezone = EXCLUDED.timezone,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;
