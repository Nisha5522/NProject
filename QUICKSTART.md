# Quick Start Guide

## Initial Setup (First Time Only)

### 1. Setup PostgreSQL Database

Open PostgreSQL command line (psql) and run:

```sql
CREATE DATABASE store_rating_db;
```

### 2. Configure Backend Environment

The backend `.env` file is already configured with default settings:

- Database: store_rating_db
- User: postgres
- Password: postgres (change if your password is different)

If needed, edit `backend/.env`:

```env
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

### 3. Run Database Migration

This creates tables and adds sample data:

```bash
cd backend
npm run migrate
```

You should see:

```
✓ Database synced successfully
✓ Admin user created
✓ Sample stores created
✓ Store owners created
✓ Sample user created
✓ Sample ratings created
```

### 4. Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**

```bash
# From project root
npm start
```

Frontend runs on: http://localhost:3000

## Testing the Application

### Login with Demo Accounts:

1. **Admin Dashboard**
   - Email: admin@example.com
   - Password: Admin@123
   - Access: Admin dashboard with statistics, user management, store management

2. **Store Owner Dashboard**
   - Email: owner1@example.com
   - Password: Owner@123
   - Access: View ratings for owned store

3. **Normal User**
   - Email: user@example.com
   - Password: User@123
   - Access: Browse stores, submit ratings

### Sign Up as New User

1. Click "Sign Up" on sign-in page
2. Fill form with:
   - Name: At least 20 characters (e.g., "John Michael Anderson Smith")
   - Email: Valid email
   - Address: Your address
   - Password: 8-16 chars with uppercase & special char (e.g., "Password@123")
3. Submit to create account and auto-login

## Features to Test

### As Admin:

- [ ] View dashboard statistics
- [ ] Browse all users with filters
- [ ] Browse all stores with filters
- [ ] Sort tables by different columns
- [ ] Update password

### As Normal User:

- [ ] Sign up new account
- [ ] Sign in
- [ ] Browse stores
- [ ] Search stores by name/address
- [ ] Submit rating (1-5 stars)
- [ ] Modify existing rating
- [ ] Sort stores by name/rating
- [ ] Update password

### As Store Owner:

- [ ] Sign in
- [ ] View store's average rating
- [ ] View list of users who rated
- [ ] See individual ratings
- [ ] Update password

## API Testing (Optional)

You can test the API directly using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'

# Get stores (requires token)
curl http://localhost:5000/api/stores \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

### "Database connection error"

- Ensure PostgreSQL is running
- Check credentials in `backend/.env`
- Verify database exists: `psql -U postgres -c "\l"`

### "Port 5000 already in use"

- Change PORT in `backend/.env`
- Or kill process using port: `netstat -ano | findstr :5000`

### "Port 3000 already in use"

- Frontend will automatically use next available port
- Or change in `webpack.config.js`

### "Migration failed"

- Drop and recreate database:
  ```sql
  DROP DATABASE store_rating_db;
  CREATE DATABASE store_rating_db;
  ```
- Run migration again: `npm run migrate`

## Reset Database

To start fresh:

```bash
# In psql
DROP DATABASE store_rating_db;
CREATE DATABASE store_rating_db;

# Run migration
cd backend
npm run migrate
```

## Stopping the Application

Press `Ctrl+C` in both terminal windows to stop servers.

## Next Steps

- Explore the codebase
- Try different user roles
- Test all CRUD operations
- Check form validations
- Test sorting and filtering
- Verify password requirements

Happy coding! 🚀
