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


create_table()


def get_data_from_write():
    try:
        conn = get_db_connection()

        if conn.is_connected():
            print("Connected to MySQL")

            cursor = conn.cursor()

            tb_write = "SELECT * FROM tb_write"
            cursor.execute(tb_write)
            columns1 = [column[0] for column in cursor.description]
            tb_write_row = cursor.fetchall()

            tb_cate = "SELECT * FROM tb_cate"
            cursor.execute(tb_cate)
            columns2 = [column[0] for column in cursor.description]
            tb_cate_row = cursor.fetchall()

            # JSON 형식으로 데이터 만들기
            tb_write_data = []
            for row in tb_write_row:
                row_data = dict(zip(columns1, row))
                tb_write_data.append(row_data)

            tb_cate_data = []
            for row in tb_cate_row:
                row_data = dict(zip(columns2, row))
                tb_cate_data.append(row_data)

            # JSON 출력 또는 파일 저장
            tb_write_res = json.dumps(tb_write_data, indent=2)
            tb_cate_res = json.dumps(tb_cate_data, indent=2)

            cursor.close()

            return tb_write_res, tb_cate_res

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


def get_data_from_memo():
    try:
        conn = get_db_connection()

        if conn.is_connected():
            print("Connected to MySQL")

            cursor = conn.cursor()

            tb_memo = "SELECT * FROM tb_memo"
            cursor.execute(tb_memo)
            columns_memo = [column[0] for column in cursor.description]
            tb_memo_row = cursor.fetchall()

            # JSON 형식으로 데이터 만들기
            tb_memo_data = []
            for row in tb_memo_row:
                row_data = dict(zip(columns_memo, row))
                tb_memo_data.append(row_data)

            # JSON 출력 또는 파일 저장
            tb_memo_res = json.dumps(tb_memo_data, indent=2)
            cursor.close()

            return tb_memo_res

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
