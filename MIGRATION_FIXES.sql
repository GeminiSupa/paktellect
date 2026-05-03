-- 1. Update Booking Status Constraint
-- The current constraint is missing 'completed', which prevents experts from finalizing sessions.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'requested'));

-- 2. Update Teacher Category Constraint
-- Ensure all modern trade categories are supported.
ALTER TABLE teachers DROP CONSTRAINT IF EXISTS teachers_category_check;
ALTER TABLE teachers ADD CONSTRAINT teachers_category_check 
  CHECK (category IN (
    'Academic', 
    'Legal', 
    'Wellness', 
    'Mental Health', 
    'Plumbing', 
    'Electrical', 
    'Logistics', 
    'Mechanics'
  ));
