# PostgreSQL Setup and Start Guide

## Your PostgreSQL Installation

Location: `C:\Program Files\pgsql\bin`

## Issue

PostgreSQL is installed but not initialized/configured. Here's how to fix it:

## Option 1: Quick Start with pgAdmin (Easiest)

1. **Open pgAdmin 4**
   - Location: `C:\Program Files\pgsql\pgAdmin 4\bin\pgAdmin4.exe`
   - Or search for "pgAdmin 4" in Windows Start menu

2. **In pgAdmin:**
   - Connect to PostgreSQL server (it should auto-detect)
   - Right-click on "Databases" → Create → Database
   - Database name: `store_rating_db`
   - Click Save

3. **Then run:**
   ```bash
   cd C:\Users\rushi\OneDrive\Desktop\NProject\backend
   npm run migrate
   npm run dev
   ```

## Option 2: Initialize PostgreSQL via Command Line

If pgAdmin doesn't work, initialize PostgreSQL:

```powershell
# Create data directory
New-Item -ItemType Directory -Path "C:\pgsql\data" -Force

# Initialize database cluster
& "C:\Program Files\pgsql\bin\initdb.exe" -D "C:\pgsql\data" -U postgres -W

# Start PostgreSQL
& "C:\Program Files\pgsql\bin\pg_ctl.exe" -D "C:\pgsql\data" start

# Create database
& "C:\Program Files\pgsql\bin\createdb.exe" -U postgres store_rating_db
```

## Option 3: Use Our Node.js Script (After PostgreSQL is running)

Once PostgreSQL is running (via Option 1 or 2):

```bash
cd backend
npm run createdb
npm run migrate
```

## Quick Test

After PostgreSQL is running, test connection:

```powershell
& "C:\Program Files\pgsql\bin\psql.exe" -U postgres -c "SELECT version();"
```

## Still Having Issues?

If none of these work, the easiest solution is to **reinstall PostgreSQL** properly:

1. Uninstall current PostgreSQL
2. Download installer from: https://www.postgresql.org/download/windows/
3. Run the installer (it will set everything up automatically)
4. During installation, set password for 'postgres' user
5. Make sure "PostgreSQL Server" service is selected to install
6. After install, it will auto-start

Then update `backend/.env`:

```env
DB_PASSWORD=your_password_from_installation
```

## Alternative: Use SQLite

If you want to skip PostgreSQL setup completely and test the app quickly:

```
I can convert the project to use SQLite in 2 minutes - just let me know!
```
