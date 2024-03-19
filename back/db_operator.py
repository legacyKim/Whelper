import json
from db_config import db_config
from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table, Text, text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


Base_write = declarative_base()
Base_memo = declarative_base()


class Write(Base_write):
    __tablename__ = 'tb_write'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title = Column(String(255))
    subTitle = Column(String(255))
    content = Column(Text)
    keywords = Column(String(255))


class Category(Base_write):
    __tablename__ = 'tb_cate'

    id = Column(Integer, primary_key=True)
    category = Column(String(255))


class Memo(Base_memo):
    __tablename__ = 'tb_memo'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    memoComment = Column(String(1255))
    memoSource = Column(String(255))
    memoAuthor = Column(String(255))
    memoAnnotation = Column(JSON)


class Book(Base_memo):
    __tablename__ = 'tb_book'

    id = Column(Integer, primary_key=True)
    book = Column(String(255))
    author = Column(String(255))


config_write, config_memo = db_config()

engine_write = create_engine(
    f"mysql://{config_write['user']}:{config_write['password']}@{config_write['host']}/{config_write['database']}", echo=True)

engine_memo = create_engine(
    f"mysql://{config_memo['user']}:{config_memo['password']}@{config_memo['host']}/{config_memo['database']}", echo=True)

Session_write = sessionmaker(bind=engine_write)
Session_memo = sessionmaker(bind=engine_memo)


def create_table():

    Base_write.metadata.create_all(engine_write)
    Base_memo.metadata.create_all(engine_memo)


def post_data_from_write(data):
    try:
        with Session_write() as session:
            write_instance = Write(**data)
            session.add(write_instance)
            session.commit()
    except Exception as e:
        print(f"Error adding data: {e}")


def update_data_from_write(data, write_id):

    session = Session_write()

    try:

        write_instance = session.query(Write).filter_by(id=write_id).first()

        if write_instance:
            for key, value in data.items():
                setattr(write_instance, key, value)

            # 세션 커밋
            session.commit()
            print(f"Data with id={write_id} updated successfully")
        else:
            print(f"No data found with id={write_id}")

    except Exception as e:
        print(f"Error updating data: {e}")
        # 에러 발생 시 롤백
        session.rollback()
    finally:
        # 세션 닫기
        session.close()


def post_data_from_memo(data):
    try:
        with Session_memo() as session:
            memo_instance = Memo(**data)
            session.add(memo_instance)
            session.commit()
    except Exception as e:
        print(f"Error adding data: {e}")


def update_data_from_memo(data, memo_id):

    session = Session_memo()

    try:

        memo_instance = session.query(Memo).filter_by(id=memo_id).first()

        print('=====================', memo_instance)

        if memo_instance:
            for key, value in data.items():
                setattr(memo_instance, key, value)

            session.commit()
            print(f"Data with id={memo_id} updated successfully")
        else:
            print(f"No data found with id={memo_id}")

    except Exception as e:
        print(f"Error updating data: {e}")
        session.rollback()
    finally:
        # 세션 닫기
        session.close()


def post_data_from_book(data):
    try:
        with Session_memo() as session:
            book_instance = Memo(**data)
            session.add(book_instance)
            session.commit()
    except Exception as e:
        print(f"Error adding data: {e}")


if __name__ == '__main__':
    create_table()
    data = {'title': 'Example Title', 'subTitle': 'Example Subtitle',
            'content': 'Example Content', 'keywords': 'Example Keyword'}

    post_data_from_write(data)
    post_data_from_memo(data)

    update_data_from_write(data)
    update_data_from_memo(data)
