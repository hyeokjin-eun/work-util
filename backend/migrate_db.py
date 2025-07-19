#!/usr/bin/env python3
import sqlite3

# Connect to database
conn = sqlite3.connect('work_util.db')
cursor = conn.cursor()

try:
    # First, check if hashed_password column already exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if 'hashed_password' not in columns:
        print("Adding hashed_password column...")
        # Add hashed_password column
        cursor.execute("ALTER TABLE users ADD COLUMN hashed_password VARCHAR(100)")
        
        # Copy data from password_hash to hashed_password
        cursor.execute("UPDATE users SET hashed_password = password_hash")
        
        print("Migration completed successfully!")
    else:
        print("hashed_password column already exists")
    
    # Also add is_active column if it doesn't exist
    if 'is_active' not in columns:
        print("Adding is_active column...")
        cursor.execute("ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT 1")
    
    conn.commit()
    
    # Verify the changes
    cursor.execute("PRAGMA table_info(users)")
    columns = cursor.fetchall()
    print("\nUpdated users table schema:")
    for col in columns:
        print(f"  {col[1]} {col[2]}")
    
except Exception as e:
    print(f"Error: {e}")
    conn.rollback()
finally:
    conn.close()