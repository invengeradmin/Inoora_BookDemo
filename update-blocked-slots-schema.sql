-- Create blocked_slots table if it doesn't exist
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  reason VARCHAR(255),
  blocked_by UUID REFERENCES agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, time)
);

-- Add assigned_at column to demo_sessions if it doesn't exist
ALTER TABLE demo_sessions ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;

-- Make agent_id nullable for unassigned sessions
ALTER TABLE demo_sessions ALTER COLUMN agent_id DROP NOT NULL;
