import json
from db_config import db_config

from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table

config = db_config()

engine = create_engine(
    f"mysql://{config['user']}:{config['password']}@{config['host']}/{config['database']}", echo=True)

metadata = MetaData()

tb_write = Table('tb_write', metadata,
                 Column('id', Integer, primary_key=True),
                 Column('title', String(255)),
                 Column('subTitle', String(255)),
                 Column('content', String(255)),
                 Column('keywords', String(255)),
                 )

tb_cate = Table('tb_cate', metadata,
                Column('id', Integer, primary_key=True),
                Column('category', String(255)),
                )


def create_table():

    # 테이블 생성
    metadata.create_all(engine)


def insert_data():
    # 데이터 삽입
    with engine.connect() as connection:
        connection.execute(tb_write.insert().values(
            title='John', subTitle='Doe', content='Example Content', keywords='example'))
    print("Data inserted successfully.")


def look_data():
    # 데이터 조회
    with engine.connect() as connection:
        result = connection.execute(select([tb_write]))
        for row in result:
            keywords_from_db = json.loads(row['keywords'])
            print(
                f"ID: {row['id']}, Title: {row['title']}, Subtitle: {row['subTitle']}, Content: {row['content']}, Keywords: {keywords_from_db}")
