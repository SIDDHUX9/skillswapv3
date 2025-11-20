-- DELETE ALL EXISTING TABLES AND RECREATE CLEAN DATABASE
-- Run this FIRST to clean up, then run the main schema

-- Drop all tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS chat_rooms CASCADE;
DROP TABLE IF EXISTS project_volunteers CASCADE;
DROP TABLE IF EXISTS cal_links CASCADE;
DROP TABLE IF EXISTS credit_txns CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS community_projects CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS credit_type CASCADE;
DROP TYPE IF EXISTS skill_category CASCADE;

-- Drop the trigger function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Confirm cleanup
SELECT 'All tables and types dropped successfully!' as status;