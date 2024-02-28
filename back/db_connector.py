import os
import mysql.connector
import json
from db_operator import create_table
from db_config import db_config
from dotenv import load_dotenv

load_dotenv()


def get_db_connection():
    config = db_config()
    return mysql.connector.connect(**config)


def execute_query_and_get_data(query):

    try:
        conn = get_db_connection()

        if conn.is_connected():
            print("Connected to MySQL")

            cursor = conn.cursor()
            cursor.execute(query)
            columns = [column[0] for column in cursor.description]
            rows = cursor.fetchall()

            data = []
            for row in rows:
                row_data = dict(zip(columns, row))
                data.append(row_data)

            # JSON 형식으로 데이터 만들기
            result = json.dumps(data, indent=2)

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


def get_data_from_write():
    query = "SELECT * FROM tb_write; SELECT * FROM tb_cate;"
    return execute_query_and_get_data(query)


def get_data_from_memo():
    query = "SELECT * FROM tb_memo; SELECT * FROM tb_book;"
    return execute_query_and_get_data(query)


if __name__ == '__main__':
    # db_connector.py 파일이 독립적으로 실행될 때의 동작 정의
    pass
