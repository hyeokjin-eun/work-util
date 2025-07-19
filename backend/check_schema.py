#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('work_util.db')
cursor = conn.cursor()

# Check users table schema
cursor.execute("PRAGMA table_info(users)")
columns = cursor.fetchall()

print("Users table schema:")
for col in columns:
    print(f"  {col[1]} {col[2]}")

# Check if password column exists
cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'")
create_statement = cursor.fetchone()
print("\nCREATE statement:")
print(create_statement[0])

conn.close()