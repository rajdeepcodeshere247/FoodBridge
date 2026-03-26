# FoodBridge Database Design

## Tables Overview

### users
Stores all app users (donors, volunteers, NGOs).
Key fields: id, google_id, name, email, avatar_url, role, created_at

### food_listings
Food items posted for donation.
Key fields: id, donor_id (FK), title, quantity, expiry_time, image_url, quality_status, quality_confidence, latitude, longitude, status

### deliveries
Tracks volunteer pickup and delivery.
Key fields: id, food_id (FK), volunteer_id (FK), recipient_id (FK), status, claimed_at, delivered_at

## Relationships
- users (1) --> (many) food_listings  [donor posts food]
- food_listings (1) --> (1) deliveries  [one delivery per listing]
- users (1) --> (many) deliveries  [volunteer handles many deliveries]
