-- Create the blocked_slots table for admin slot management
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  reason VARCHAR(255),
  blocked_by UUID REFERENCES agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, time)
);

-- Add index for better performance on date/time queries
CREATE INDEX IF NOT EXISTS idx_blocked_slots_date_time ON blocked_slots(date, time);

-- Add index for queries by blocked_by agent
CREATE INDEX IF NOT EXISTS idx_blocked_slots_blocked_by ON blocked_slots(blocked_by);

-- Add a comment to document the table
COMMENT ON TABLE blocked_slots IS 'Stores time slots that have been blocked by admins to prevent bookings';
COMMENT ON COLUMN blocked_slots.date IS 'The date of the blocked slot (YYYY-MM-DD)';
COMMENT ON COLUMN blocked_slots.time IS 'The time of the blocked slot (HH:MM format)';
COMMENT ON COLUMN blocked_slots.reason IS 'Optional reason for blocking the slot';
COMMENT ON COLUMN blocked_slots.blocked_by IS 'ID of the agent who blocked the slot';
