# FoodBridge API Reference

## Base URL
`http://localhost:5000/api`

## Authentication
All protected routes require an active session cookie (set after Google OAuth login).

---

## Auth Routes

### GET /auth/google
Redirects user to Google login page.

### GET /auth/google/callback
Google calls this after login. Redirects to frontend dashboard on success.

### GET /auth/me
Returns the currently logged-in user.

### GET /auth/logout
Destroys session and logs out.

---

## Food Routes

### GET /food
Returns all available food listings.

### GET /food/nearby?lat=&lng=&radius=
Returns food listings within radius km of given coordinates.

### POST /food
Creates a new food listing (multipart/form-data).
Fields: title, description, quantity, food_type, expiry_time, latitude, longitude, address, image (file)

### PUT /food/:id
Updates a food listing.

### DELETE /food/:id
Deletes a food listing.

---

## Delivery Routes

### GET /deliveries
Returns all pending deliveries.

### POST /deliveries
Volunteer claims a food pickup. Body: { food_id, notes }

### PUT /deliveries/:id/status
Updates delivery status. Body: { status } — pending | picked_up | delivered | cancelled

---

## AI Routes

### POST /ai/check-quality
Analyzes food image. Body: multipart/form-data with field 'image'
Response: { quality_status: 'fresh'|'moderate'|'spoiled', confidence: 0.0-1.0 }
