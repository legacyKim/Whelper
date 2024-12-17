import os
import mysql.connector
import json
from db_operator import create_table
from db_config import db_config
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()


def get_db_connection(db_index):
    config = db_config()
    conn = mysql.connector.connect(**config[db_index])
    return conn


create_table()


def excute_query_get_data(queries, conn):
    try:
        if conn.is_connected():
            cursor = conn.cursor()

            results = []
            for query in queries:
                cursor.execute(query)
                columns = [column[0] for column in cursor.description]
                rows = cursor.fetchall()

                data = []
                for row in rows:
                    row_data = dict(zip(columns, row))

                    if 'memoAnnotation' in row_data and isinstance(row_data['memoAnnotation'], str):
                        try:
                            row_data['memoAnnotation'] = json.loads(
                                row_data['memoAnnotation'])
                        except json.JSONDecodeError:
                            print(
                                f"Failed to parse memoAnnotation field for row {row}")

                    for key, value in row_data.items():
                        if isinstance(value, datetime):
                            kst_value = value + timedelta(hours=9)
                            row_data[key] = kst_value.isoformat()

                    data.append(row_data)

                result = json.dumps(data, indent=2)
                results.append(result)

            cursor.close()

            return results

        # 연결 닫기
        conn.close()
        print("MySQL connection closed")

    except mysql.connector.Error as err:
        print(f"Failed to connect to MySQL: {err}")
        raise

    finally:
        # 연결 닫기
        if conn.is_connected():
            conn.close()
            print("MySQL connection closed")


def get_data_from_write():
    conn = get_db_connection(0)

    queries = ["SELECT * FROM tb_write;", "SELECT * FROM tb_cate;"]
    results = excute_query_get_data(queries, conn)

    return results[0], results[1]


def get_data_from_memo():
    conn = get_db_connection(1)

    queries = ["SELECT * FROM tb_memo;", "SELECT * FROM tb_book;"]
    results = excute_query_get_data(queries, conn)

    return results[0], results[1]


def get_data_from_user():
    conn = get_db_connection(2)

    queries = ["SELECT id, username, authority FROM tb_user;"]
    results = excute_query_get_data(queries, conn)

    return results[0]


if __name__ == '__main__':
    pass
