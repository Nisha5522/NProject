# PostgreSQL Installation Guide

## PostgreSQL is NOT Installed

Your system doesn't have PostgreSQL installed. Here are your options:

## Option 1: Install PostgreSQL (Recommended)

### Download and Install:

1. Visit: https://www.postgresql.org/download/windows/
2. Download PostgreSQL installer (version 12 or higher)
3. Run the installer
4. During installation:
   - Set password for postgres user (remember this!)
   - Default port: 5432
   - Install pgAdmin 4 (GUI tool)

### After Installation:

```bash
# Update backend/.env with your password
DB_PASSWORD=your_password_here

# Then run:
cd backend
npm run createdb
npm run migrate
npm run dev
```

## Option 2: Use SQLite Instead (Quick Alternative)

If you want to test quickly without installing PostgreSQL, I can convert the project to use SQLite (file-based database).

### Advantages of SQLite:

- ✅ No installation needed
- ✅ Works immediately
- ✅ Good for development/testing
- ✅ Same code structure

### Disadvantages:

- ❌ Not suitable for production
- ❌ Limited concurrent users
- ❌ Fewer features than PostgreSQL

Would you like me to:

1. **Wait for you to install PostgreSQL** (recommended), OR
2. **Convert to SQLite** for quick testing?

## Option 3: Use Docker PostgreSQL

If you have Docker installed:

```bash
docker run --name postgres-store-rating -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14

# Then update backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres

# Run setup
npm run createdb
npm run migrate
```

## Quick Check: Do you have PostgreSQL?

Run in PowerShell:

```powershell
Get-Service -Name "*postgres*"
```

If nothing shows up, PostgreSQL is not installed.

## Recommended Next Steps:

1. **Install PostgreSQL** from: https://www.postgresql.org/download/windows/
2. **Set password** during installation (e.g., "postgres")
3. **Update** `backend/.env` with your password
4. **Run** setup commands

OR

Let me know if you want to use SQLite instead for quick testing!
