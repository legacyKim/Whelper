import os
import mysql.connector
import json
from db_operator import create_table, insert_data, look_data
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


create_table()


def get_data_from_db():
    try:
        conn = get_db_connection()

        if conn.is_connected():
            print("Connected to MySQL")

            cursor = conn.cursor()

            query = "SELECT * FROM tb_write"
            cursor.execute(query)

            # 컬럼 이름 가져오기
            columns = [column[0] for column in cursor.description]

            # 모든 행 가져오기
            rows = cursor.fetchall()

            # JSON 형식으로 데이터 만들기
            data = []
            for row in rows:
                row_data = dict(zip(columns, row))
                data.append(row_data)

            # JSON 출력 또는 파일 저장
            result = json.dumps(data, indent=2)
            print(result)

            cursor.close()

            return result

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
