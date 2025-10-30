-- Add role column to agents table if it doesn't exist
ALTER TABLE agents ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'agent' CHECK (role IN ('agent', 'super_admin'));

-- Update existing agents to have agent role
UPDATE agents SET role = 'agent' WHERE role IS NULL;

-- Clear existing agents and insert new ones with correct credentials
DELETE FROM agents;

-- Insert super admin
INSERT INTO agents (email, name, title, timezone, role, is_active) VALUES
('info@inoora.ai', 'Super Admin', 'System Administrator', 'UTC', 'super_admin', true);

-- Insert agent
INSERT INTO agents (email, name, title, timezone, role, is_active) VALUES
('benjamin.macklin@invenger.com', 'Benjamin Macklin', 'Sales Executive', 'America/New_York', 'agent', true);
