-- Add password_hash column to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Update the existing agents with default password hashes (this is just for demo purposes)
-- In a real application, you would use proper password hashing
UPDATE agents SET password_hash = '$2a$10$XdR0Z.XuJ1/4XOxZ3dCv8.7hgI9Y7GNZgfF9m1F5XeZJQGW7XwBxe' WHERE password_hash IS NULL;
