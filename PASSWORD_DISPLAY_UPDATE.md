# Password Display Update - DEMO MODE ONLY

## ⚠️ SECURITY WARNING

**This configuration is for DEMO/DEVELOPMENT purposes ONLY!**
**NEVER use this in production - it exposes user passwords!**

## Changes Made

### 1. User Model Updated

- Added `plainPassword` field to store unencrypted passwords
- Updated hooks to save plain password before hashing
- **File**: `backend/models/User.js`

### 2. API Updated

- Modified `/api/auth/credentials` endpoint to return actual passwords
- **File**: `backend/routes/auth.js`

### 3. Frontend Updated

- Login page now displays actual passwords with 🔑 icon
- Styled with green badge for visibility
- **Files**: `src/pages/SignIn.js`, `src/styles/auth.css`

### 4. Edit Functionality Complete

- Admin can now edit users and stores
- Edit buttons added to both tables
- Modals support both create and edit modes
- Password field is optional when editing (leave blank to keep current)
- **File**: `src/pages/AdminDashboard.js`

## How to Use

1. **Run Migration** (This will reset all data):

   ```bash
   cd backend
   node scripts/migrate.js
   ```

2. **Start Backend**:

   ```bash
   cd backend
   npm start
   ```

3. **Start Frontend**:

   ```bash
   npm start
   ```

4. **Access Login Page**:
   - Click "Show Available Credentials" button
   - All users grouped by role (Admin, Owner, User)
   - Each credential shows: Name, Email, and **Password** 🔑
   - Click any credential to auto-fill the email
   - Copy the password shown

## Default Credentials (After Migration)

**Admin:**

- Email: admin@example.com
- Password: Admin@123

**Store Owners:**

- Email: owner1@example.com / Password: Owner@123
- Email: owner2@example.com / Password: Owner@123

**Regular Users:**

- Email: user1@example.com / Password: User@123
- Email: user2@example.com / Password: User@123

## Edit Functionality

**In Admin Dashboard:**

1. Navigate to Users or Stores tab
2. Click "✏️ Edit" button on any row
3. Modal opens with pre-filled data
4. Make changes (password optional - leave blank to keep current)
5. Click "💾 Update User/Store"

**Features:**

- ✅ Edit user details (name, email, address, role, store)
- ✅ Edit store details (name, email, address)
- ✅ Optional password update (leave blank = no change)
- ✅ Email uniqueness validation
- ✅ Same validation rules as creation

## Migration Impact

Running the migration script will:

- ⚠️ **Drop all existing tables**
- ✅ Create fresh tables with new schema
- ✅ Add `plainPassword` column to users table
- ✅ Seed default admin, owners, stores, and sample users
- ✅ All new users will have `plainPassword` stored

## Production Considerations

**Before going to production:**

1. ❌ Remove `plainPassword` field from User model
2. ❌ Remove password exposure from `/api/auth/credentials` endpoint
3. ❌ Update SignIn page to not display passwords
4. ✅ Implement proper password reset flow
5. ✅ Add email verification
6. ✅ Use environment variables for sensitive data
7. ✅ Enable HTTPS only
8. ✅ Add rate limiting to auth endpoints

## Why This is Unsafe

- 🚫 Stores passwords in plain text (defeats encryption purpose)
- 🚫 Exposes passwords via API endpoint
- 🚫 Anyone can see all user passwords on login page
- 🚫 If database is breached, all passwords are compromised
- 🚫 Violates GDPR, PCI-DSS, and security best practices

**Use this ONLY for:**

- ✅ Local development
- ✅ Demo presentations
- ✅ Testing/QA environments (non-production data)
- ✅ Learning purposes

---

**Remember**: This is a developer convenience feature for demos. Real applications should NEVER store or display plain passwords!
