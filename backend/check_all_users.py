#!/usr/bin/env python3
import sqlite3

# Check both database files
for db_file in ['work_util.db', 'app.db']:
    print(f"\n=== Checking {db_file} ===")
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Check if users table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'")
        if cursor.fetchone():
            print("Users table exists")
            
            # Get table schema
            cursor.execute("PRAGMA table_info(users)")
            columns = cursor.fetchall()
            print("Table schema:")
            for col in columns:
                print(f"  {col[1]} {col[2]}")
            
            # Get all users
            cursor.execute("SELECT * FROM users")
            users = cursor.fetchall()
            print(f"\nFound {len(users)} users:")
            for user in users:
                print(f"  User: {user}")
        else:
            print("Users table does not exist")
        
        conn.close()
    except Exception as e:
        print(f"Error accessing {db_file}: {e}")