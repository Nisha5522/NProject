# Setup Verification Checklist

Run through this checklist to ensure everything is set up correctly.

## Prerequisites Check

### 1. Node.js Installation

```bash
node --version
# Should show v14.0.0 or higher
```

### 2. npm Installation

```bash
npm --version
# Should show 6.0.0 or higher
```

### 3. PostgreSQL Installation

```bash
psql --version
# Should show PostgreSQL 12 or higher
```

### 4. PostgreSQL Service Running

**Windows:**

- Open Services (services.msc)
- Look for "postgresql-x64-XX"
- Status should be "Running"

**Command line test:**

```bash
psql -U postgres -c "SELECT version();"
# Should connect and show PostgreSQL version
```

## Project Setup Verification

### 1. Dependencies Installed ✓

**Frontend dependencies:**

```bash
cd c:\Users\rushi\OneDrive\Desktop\NProject
npm list --depth=0
```

Should show:

- react@18.2.0
- react-dom@18.2.0
- react-router-dom@6.20.0
- axios@1.6.2

**Backend dependencies:**

```bash
cd backend
npm list --depth=0
```

Should show:

- express@4.18.2
- pg@8.11.3
- sequelize@6.35.2
- jsonwebtoken@9.0.2
- bcryptjs@2.4.3
- cors@2.8.5
- express-validator@7.0.1

### 2. Database Created ✓

```bash
psql -U postgres
```

Then in psql:

```sql
\l
-- Should list store_rating_db

\c store_rating_db
-- Connect to database

\dt
-- Should show tables: users, stores, ratings

-- Check sample data
SELECT COUNT(*) FROM users;
-- Should return 4 (1 admin, 2 owners, 1 user)

SELECT COUNT(*) FROM stores;
-- Should return 2

SELECT COUNT(*) FROM ratings;
-- Should return 2

\q
-- Exit psql
```

### 3. Environment Variables ✓

Check `backend/.env` file exists and contains:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=<your-password>
JWT_SECRET=<secret-key>
```

### 4. File Structure ✓

```
NProject/
├── backend/
│   ├── config/
│   │   └── database.js ✓
│   ├── models/
│   │   ├── User.js ✓
│   │   ├── Store.js ✓
│   │   ├── Rating.js ✓
│   │   └── index.js ✓
│   ├── routes/
│   │   ├── auth.js ✓
│   │   ├── admin.js ✓
│   │   └── stores.js ✓
│   ├── middleware/
│   │   ├── auth.js ✓
│   │   └── validation.js ✓
│   ├── scripts/
│   │   └── migrate.js ✓
│   ├── .env ✓
│   ├── package.json ✓
│   └── server.js ✓
├── src/
│   ├── components/
│   │   ├── RoleBasedRoute.js ✓
│   │   └── PrivateRoute.js ✓
│   ├── context/
│   │   └── AuthContext.js ✓
│   ├── pages/
│   │   ├── SignUp.js ✓
│   │   ├── SignIn.js ✓
│   │   ├── AdminDashboard.js ✓
│   │   ├── UserDashboard.js ✓
│   │   ├── StoresList.js ✓
│   │   ├── OwnerDashboard.js ✓
│   │   └── UpdatePassword.js ✓
│   ├── styles/
│   │   ├── global.css ✓
│   │   ├── auth.css ✓
│   │   ├── dashboard.css ✓
│   │   └── stores.css ✓
│   ├── utils/
│   │   ├── api.js ✓
│   │   └── validation.js ✓
│   ├── App.js ✓
│   └── index.js ✓
├── public/
│   └── index.html ✓
├── package.json ✓
├── webpack.config.js ✓
├── .babelrc ✓
├── README.md ✓
├── QUICKSTART.md ✓
└── IMPLEMENTATION_SUMMARY.md ✓
```

## Running Verification

### 1. Backend Start Test

```bash
cd backend
npm run dev
```

Expected output:

```
Database connected successfully
Server is running on port 5000
Environment: development
```

Test backend health:

```bash
curl http://localhost:5000/api/health
# Or open in browser
```

Expected response:

```json
{ "status": "OK", "message": "Server is running" }
```

### 2. Frontend Start Test

In a new terminal:

```bash
cd c:\Users\rushi\OneDrive\Desktop\NProject
npm start
```

Expected output:

```
webpack compiled successfully
```

Browser should open automatically to: http://localhost:3000

### 3. Login Test

**Test Admin Login:**

1. Go to http://localhost:3000/signin
2. Email: admin@example.com
3. Password: Admin@123
4. Should redirect to: http://localhost:3000/admin/dashboard

**Test User Login:**

1. Sign out
2. Email: user@example.com
3. Password: User@123
4. Should redirect to: http://localhost:3000/user/dashboard

**Test Owner Login:**

1. Sign out
2. Email: owner1@example.com
3. Password: Owner@123
4. Should redirect to: http://localhost:3000/owner/dashboard

### 4. API Endpoints Test

```bash
# Get JWT token first (login)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@example.com\",\"password\":\"Admin@123\"}"

# Copy the token from response, then test protected endpoint
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Functionality Verification

### Admin Panel ✓

- [ ] Can see dashboard statistics
- [ ] Can view users table
- [ ] Can filter users by name/email/role
- [ ] Can sort users table
- [ ] Can view stores table
- [ ] Can filter stores
- [ ] Can sort stores table

### User Panel ✓

- [ ] Can sign up with valid data
- [ ] Validation errors show for invalid data
- [ ] Can sign in
- [ ] Can view stores list
- [ ] Can search stores
- [ ] Can submit rating
- [ ] Rating modal opens
- [ ] Can select 1-5 stars
- [ ] Can modify existing rating
- [ ] Can update password

### Owner Panel ✓

- [ ] Can sign in
- [ ] Can see store name
- [ ] Can see average rating
- [ ] Can see list of raters
- [ ] Can see individual ratings
- [ ] Can update password

## Common Issues & Solutions

### Issue: "Database connection error"

**Solution:**

1. Check PostgreSQL is running
2. Verify credentials in `backend/.env`
3. Ensure database exists: `psql -U postgres -l`

### Issue: "Port 5000 already in use"

**Solution:**

1. Find process: `netstat -ano | findstr :5000`
2. Kill process or change port in `backend/.env`

### Issue: "Module not found"

**Solution:**

1. Reinstall dependencies:
   ```bash
   cd backend && npm install
   cd .. && npm install
   ```

### Issue: "Cannot login"

**Solution:**

1. Verify migration ran successfully
2. Check database has users:
   ```sql
   psql -U postgres store_rating_db
   SELECT email FROM users;
   ```

### Issue: "CORS error"

**Solution:**

- Backend server must be running
- Check backend URL in `src/utils/api.js`

### Issue: "JWT token error"

**Solution:**

- Clear localStorage: `localStorage.clear()`
- Sign in again

## Performance Check

### Database Indexes

```sql
-- Check indexes exist
\di
-- Should show indexes on foreign keys and unique columns
```

### API Response Time

- Login: < 500ms
- Get stores: < 300ms
- Submit rating: < 400ms

## Security Verification ✓

- [ ] Passwords are hashed (not visible in database)
- [ ] JWT token required for protected routes
- [ ] Role-based access control enforced
- [ ] Input validation working
- [ ] SQL injection prevented (using Sequelize)
- [ ] CORS configured correctly

## All Systems Go! ✅

If all checks pass:

- ✅ Backend running on port 5000
- ✅ Frontend running on port 3000
- ✅ Database connected
- ✅ All tables created
- ✅ Sample data loaded
- ✅ Authentication working
- ✅ All features functional

**You're ready to demo the application!**

## Next Steps

1. Test all user journeys
2. Verify form validations
3. Test sorting and filtering
4. Verify rating system
5. Test password updates
6. Check role-based access

## Support

If you encounter issues:

1. Check the error message carefully
2. Review QUICKSTART.md
3. Check console logs (browser & terminal)
4. Verify environment variables
5. Restart servers

Happy coding! 🚀
