import json
from db_config import db_config

from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table

config = db_config()

engine_01 = create_engine(
    f"mysql://{config['user']}:{config['password']}@{config['host']}/{config['database1']}", echo=True)

engine_02 = create_engine(
    f"mysql://{config['user']}:{config['password']}@{config['host']}/{config['database2']}", echo=True)

md_write = MetaData()
md_memo = MetaData()

tb_write = Table('tb_write', md_write,
                 Column('id', Integer, primary_key=True),
                 Column('title', String(255)),
                 Column('subTitle', String(255)),
                 Column('content', String(255)),
                 Column('keywords', String(255)),
                 )

tb_cate = Table('tb_cate', md_write,
                Column('id', Integer, primary_key=True),
                Column('category', String(255)),
                )

tb_memo = Table('tb_memo', md_memo,
                Column('id', Integer, primary_key=True),
                Column('memoComment', String(255)),
                Column('memoSource', String(255)),
                Column('memoAuthor', String(255)),
                Column('memoAnnotation', String(255)),
                )


def create_table():

    md_write.create_all(engine_01)
    md_memo.create_all(engine_02)


if __name__ == '__main__':
    create_table()
