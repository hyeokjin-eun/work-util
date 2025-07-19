#!/usr/bin/env python3
"""
홈 화면 레이아웃 데이터 정리 마이그레이션 스크립트
테마, 색상, 전역 설정 필드들을 제거하고 sections만 유지
"""

import sqlite3
import json
import sys
import os

def migrate_home_layout_data():
    """기존 home_screen_layout 데이터에서 불필요한 필드들을 제거"""
    
    # 데이터베이스 경로
    db_path = os.path.join(os.path.dirname(__file__), 'work_util.db')
    
    if not os.path.exists(db_path):
        print(f"데이터베이스 파일을 찾을 수 없습니다: {db_path}")
        return False
    
    try:
        # 데이터베이스 연결
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # home_screen_layout 설정을 가진 모든 레코드 조회
        cursor.execute("""
            SELECT id, user_id, preference_value 
            FROM user_preferences 
            WHERE preference_key = 'home_screen_layout'
        """)
        
        records = cursor.fetchall()
        print(f"총 {len(records)}개의 home_screen_layout 설정을 찾았습니다.")
        
        updated_count = 0
        
        for record_id, user_id, preference_value in records:
            try:
                # JSON 파싱
                layout_data = json.loads(preference_value)
                print(f"사용자 {user_id}의 설정 처리 중...")
                
                # 새로운 구조로 변환 (sections만 유지)
                new_layout_data = {
                    "sections": layout_data.get("sections", [])
                }
                
                # 제거되는 필드들 로깅
                removed_fields = []
                for field in ["theme", "backgroundColor", "accentColor", "compactMode", "animationsEnabled", "showFloatingElements"]:
                    if field in layout_data:
                        removed_fields.append(field)
                
                if removed_fields:
                    print(f"  제거된 필드: {', '.join(removed_fields)}")
                
                # 업데이트
                new_preference_value = json.dumps(new_layout_data, ensure_ascii=False)
                cursor.execute("""
                    UPDATE user_preferences 
                    SET preference_value = ? 
                    WHERE id = ?
                """, (new_preference_value, record_id))
                
                updated_count += 1
                print(f"  ✅ 사용자 {user_id} 설정 업데이트 완료")
                
            except json.JSONDecodeError as e:
                print(f"  ❌ 사용자 {user_id}의 JSON 파싱 오류: {e}")
                continue
            except Exception as e:
                print(f"  ❌ 사용자 {user_id} 처리 중 오류: {e}")
                continue
        
        # 변경사항 커밋
        conn.commit()
        print(f"\n✅ 마이그레이션 완료: {updated_count}개 레코드 업데이트됨")
        
        # 결과 확인
        cursor.execute("""
            SELECT user_id, preference_value 
            FROM user_preferences 
            WHERE preference_key = 'home_screen_layout'
            LIMIT 3
        """)
        
        sample_records = cursor.fetchall()
        print("\n📋 마이그레이션 결과 샘플:")
        for user_id, preference_value in sample_records:
            layout_data = json.loads(preference_value)
            print(f"  사용자 {user_id}: {len(layout_data.get('sections', []))}개 섹션")
        
        return True
        
    except sqlite3.Error as e:
        print(f"❌ 데이터베이스 오류: {e}")
        return False
    except Exception as e:
        print(f"❌ 예상치 못한 오류: {e}")
        return False
    finally:
        if conn:
            conn.close()

def backup_database():
    """데이터베이스 백업"""
    db_path = os.path.join(os.path.dirname(__file__), 'work_util.db')
    backup_path = os.path.join(os.path.dirname(__file__), 'work_util_backup.db')
    
    try:
        import shutil
        shutil.copy2(db_path, backup_path)
        print(f"✅ 데이터베이스 백업 완료: {backup_path}")
        return True
    except Exception as e:
        print(f"❌ 백업 실패: {e}")
        return False

if __name__ == "__main__":
    print("🔄 홈 화면 레이아웃 데이터 마이그레이션 시작")
    print("=" * 50)
    
    # 백업 생성
    if not backup_database():
        print("❌ 백업 실패로 인해 마이그레이션을 중단합니다.")
        sys.exit(1)
    
    # 마이그레이션 실행
    if migrate_home_layout_data():
        print("\n🎉 마이그레이션이 성공적으로 완료되었습니다!")
    else:
        print("\n❌ 마이그레이션 실패")
        sys.exit(1)