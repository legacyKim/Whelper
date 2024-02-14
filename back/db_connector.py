import os
import mysql.connector

from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.environ.get("MYSQL_HOST"),
    "user": os.environ.get("MYSQL_USER"),
    "password": os.environ.get("MYSQL_PASSWORD"),
    "database": os.environ.get("MYSQL_DATABASE"),
}

print(db_config)

conn = mysql.connector.connect(**db_config)

if conn.is_connected():
    print("Connected to MySQL")
    conn.close()
else:
    print("Failed to connect to MySQL")

cursor = conn.cursor()

try:
    # 쿼리 실행
    query = "SELECT * FROM your_table_name"
    cursor.execute(query)

    # 결과 가져오기
    result = cursor.fetchall()

    # 결과 출력
    for row in result:
        print(row)

except Exception as e:
    print("Error:", e)

finally:
    # 연결 및 커서 닫기
    cursor.close()
    conn.close()
