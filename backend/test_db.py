#!/usr/bin/env python3
import sys
sys.path.append('.')

try:
    from app.database import get_db, engine
    from app.models import User, UserPreferences
    from sqlalchemy.orm import Session
    
    print("Testing database connection...")
    
    # Test database connection
    db = next(get_db())
    
    # Test user query
    user_count = db.query(User).count()
    print(f"Number of users: {user_count}")
    
    # Test user preferences query
    pref_count = db.query(UserPreferences).count()
    print(f"Number of user preferences: {pref_count}")
    
    # Try to get a test user
    test_user = db.query(User).filter(User.username == "testuser").first()
    if test_user:
        print(f"Test user found: {test_user.username} (ID: {test_user.id})")
    else:
        print("Test user not found")
    
    print("Database connection successful!")
    
except Exception as e:
    print(f"Error: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()