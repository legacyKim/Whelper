import mysql.connector
from dotenv import load_dotenv

load_dotenv(dotenv_path='/process.env')

db_config = {
    "host": os.environ.get("MYSQL_HOST", "default_host"),
    "user": os.environ.get("MYSQL_USER", "default_user"),
    "password": os.environ.get("MYSQL_PASSWORD", "default_password"),
    "database": os.environ.get("MYSQL_DATABASE", "default_database")
}

conn = mysql.connector.connect(**db_config)
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
