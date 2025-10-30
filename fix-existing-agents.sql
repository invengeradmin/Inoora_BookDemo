-- Add password_hash column if it doesn't exist
ALTER TABLE agents ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Ensure the existing agents exist with correct roles
INSERT INTO agents (email, name, title, timezone, role, is_active) VALUES
('info@inoora.ai', 'Super Admin', 'System Administrator', 'UTC', 'super_admin', true),
('benjamin.macklin@invenger.com', 'Benjamin Macklin', 'Sales Executive', 'America/New_York', 'agent', true)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  timezone = EXCLUDED.timezone,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- Add the demo agents as well
INSERT INTO agents (email, name, title, timezone, role, is_active) VALUES
('sarah.johnson@inoora.com', 'Sarah Johnson', 'Senior Sales Manager', 'America/New_York', 'agent', true),
('michael.chen@inoora.com', 'Michael Chen', 'Product Specialist', 'America/Los_Angeles', 'agent', true),
('emma.wilson@inoora.com', 'Emma Wilson', 'Customer Success Lead', 'Europe/London', 'agent', true)
ON CONFLICT (email) DO UPDATE SET 
  name = EXCLUDED.name,
  title = EXCLUDED.title,
  timezone = EXCLUDED.timezone,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;
