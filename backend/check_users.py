#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('work_util.db')
cursor = conn.cursor()

# Check existing users
cursor.execute("SELECT username, email FROM users")
users = cursor.fetchall()

print("Existing users:")
for user in users:
    print(f"  Username: {user[0]}, Email: {user[1]}")

conn.close()