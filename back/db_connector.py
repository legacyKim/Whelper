import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():

    db_config = {
        "host": os.environ.get("MYSQL_HOST"),
        "user": os.environ.get("MYSQL_USER"),
        "password": os.environ.get("MYSQL_PASSWORD"),
        "database": os.environ.get("MYSQL_DATABASE"),
    }

    return mysql.connector.connect(**db_config)

def get_data_from_db():
    
    try:
        conn = get_db_connection()

        if conn.is_connected():
            print("Connected to MySQL")
            cursor = conn.cursor()

            # 필요 작업 수행
            # 쿼리 실행
            query = "SELECT * FROM tb_write"
            cursor.execute(query)

            # 결과 가져오기
            result = cursor.fetchall()

            # 결과 출력
            for row in result:
                print(row)

            # 커서 닫기
            cursor.close()

        # 연결 닫기
        conn.close()
        print("MySQL connection closed")

    except mysql.connector.Error as err:
        print(f"Failed to connect to MySQL: {err}")

    finally:
        # 연결 닫기
        if conn.is_connected():
            conn.close()
            print("MySQL connection closed")

if __name__ == '__main__':
    # db_connector.py 파일이 독립적으로 실행될 때의 동작 정의
    pass