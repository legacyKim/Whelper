import os
from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table
from dotenv import load_dotenv

load_dotenv()

db_config = {
    "host": os.environ.get("MYSQL_HOST"),
    "user": os.environ.get("MYSQL_USER"),
    "password": os.environ.get("MYSQL_PASSWORD"),
    "database": os.environ.get("MYSQL_DATABASE"),
}

engine = create_engine(f"mysql://{db_config['user']}:{db_config['password']}@{db_config['host']}/{db_config['database']}", echo=True)

metadata = MetaData()

# 여기에 tb_write 는 이미 생성된 테이블에 column 구조를 설정하는건지, 아니면 tb_write 라는 테이블을 형성하면서 컬럼 구조를 설정하는건지
my_table = Table('tb_write', metadata,
                Column('id', Integer, primary_key=True),
                Column('title', String),
                Column('subTitle', String),
                Column('content', String),
                Column('keywords', String),
            )

# 테이블 생성
metadata.create_all(engine)

# 데이터 삽입
with engine.connect() as connection:
    connection.execute(my_table.insert().values(title='John', subTitle='Doe', content='Example Content', keywords='example'))

# 데이터 조회
with engine.connect() as connection:
    result = connection.execute(my_table.select())
    for row in result:
        print('test', row)
