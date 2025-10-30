-- Add timezone selection and blocked slots functionality
ALTER TABLE demo_sessions DROP COLUMN IF EXISTS duration;
ALTER TABLE demo_sessions ADD COLUMN IF NOT EXISTS customer_timezone VARCHAR(100);
ALTER TABLE demo_sessions ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE demo_sessions ALTER COLUMN agent_id DROP NOT NULL;

-- Create blocked_slots table for admin to block specific time slots
CREATE TABLE IF NOT EXISTS blocked_slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  reason VARCHAR(255),
  blocked_by UUID REFERENCES agents(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date, time)
);

-- Update demo_sessions status to include 'pending_assignment'
ALTER TABLE demo_sessions DROP CONSTRAINT IF EXISTS demo_sessions_status_check;
ALTER TABLE demo_sessions ADD CONSTRAINT demo_sessions_status_check 
CHECK (status IN ('pending_assignment', 'confirmed', 'cancelled', 'rescheduled', 'completed', 'success_pending', 'on_hold_waiting', 'regret', 'interested', 'need_in_depth_demo', 'onboard'));

-- Set default status for new sessions
ALTER TABLE demo_sessions ALTER COLUMN status SET DEFAULT 'pending_assignment';
