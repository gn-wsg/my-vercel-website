-- Add category column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(50);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- Update existing events to have a default category
UPDATE events SET category = 'Event' WHERE category IS NULL;
