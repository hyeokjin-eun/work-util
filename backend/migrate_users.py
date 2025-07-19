#!/usr/bin/env python3
import sqlite3

# Connect to both databases
source_conn = sqlite3.connect('app.db')
target_conn = sqlite3.connect('work_util.db')

source_cursor = source_conn.cursor()
target_cursor = target_conn.cursor()

try:
    # Get all users from app.db
    source_cursor.execute("SELECT id, username, email, hashed_password, is_active, created_at, updated_at FROM users")
    users = source_cursor.fetchall()
    
    print(f"Found {len(users)} users to migrate")
    
    # Clear existing users in work_util.db (if any)
    target_cursor.execute("DELETE FROM users")
    
    # Insert users into work_util.db
    for user in users:
        user_id, username, email, hashed_password, is_active, created_at, updated_at = user
        
        # Insert with both password_hash and hashed_password
        target_cursor.execute("""
            INSERT INTO users (id, username, email, password_hash, hashed_password, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, username, email, hashed_password, hashed_password, is_active, created_at, updated_at))
        
        print(f"Migrated user: {username}")
    
    target_conn.commit()
    
    # Verify migration
    target_cursor.execute("SELECT COUNT(*) FROM users")
    count = target_cursor.fetchone()[0]
    print(f"\nMigration completed! {count} users now in work_util.db")
    
    # Show first few users for verification
    target_cursor.execute("SELECT username, email FROM users LIMIT 5")
    sample_users = target_cursor.fetchall()
    print("\nSample users:")
    for user in sample_users:
        print(f"  {user[0]} - {user[1]}")

except Exception as e:
    print(f"Error during migration: {e}")
    target_conn.rollback()
finally:
    source_conn.close()
    target_conn.close()