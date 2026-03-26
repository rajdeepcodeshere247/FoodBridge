-- Sample seed data for development/testing
-- Run after schema.sql

INSERT INTO users (google_id, name, email, role) VALUES
  ('google_test_001', 'Test Donor', 'donor@test.com', 'donor'),
  ('google_test_002', 'Test Volunteer', 'volunteer@test.com', 'volunteer');

INSERT INTO food_listings (donor_id, title, quantity, expiry_time, latitude, longitude, status) VALUES
  (1, 'Rice and Dal (Leftover)', '30 plates', NOW() + INTERVAL '6 hours', 22.5726, 88.3639, 'available'),
  (1, 'Bread and Vegetables', '15 packets', NOW() + INTERVAL '4 hours', 22.5800, 88.3700, 'available');
