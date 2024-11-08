import hashlib
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, Integer, String, MetaData, Table, Text, text, DateTime
from datetime import datetime
import json
from db_config import db_config

# import pymysql
# pymysql.install_as_MySQLdb()

Base_user = declarative_base()
Base_write = declarative_base()
Base_memo = declarative_base()


class Write(Base_write):
    __tablename__ = 'tb_write'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    title = Column(String(255))
    subTitle = Column(String(255))
    content = Column(Text)
    keywords = Column(String(255))
    anno = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow,
                        onupdate=datetime.utcnow)


class Category(Base_write):
    __tablename__ = 'tb_cate'

    id = Column(Integer, primary_key=True)
    category = Column(String(255))


class Memo(Base_memo):
    __tablename__ = 'tb_memo'

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    memoComment = Column(String(1255))
    memoSource = Column(String(255))
    memoSourcePage = Column(String(255))
    memoAuthor = Column(String(255))
    memoAnnotation = Column(Text)


class Book(Base_memo):
    __tablename__ = 'tb_book'

    id = Column(Integer, primary_key=True)
    memoSource = Column(String(255))
    memoAuthor = Column(String(255))


class User(Base_user):
    __tablename__ = 'tb_user'

    id = Column(Integer, primary_key=True)
    username = Column(String(255))
    password = Column(String(255))
    authority = Column(Integer)


config_write, config_memo, config_login = db_config()

engine_write = create_engine(
    f"mysql://{config_write['user']}:{config_write['password']}@{config_write['host']}/{config_write['database']}", echo=True, pool_pre_ping=True)

engine_memo = create_engine(
    f"mysql://{config_memo['user']}:{config_memo['password']}@{config_memo['host']}/{config_memo['database']}", echo=True, pool_pre_ping=True)

engine_login = create_engine(
    f"mysql://{config_login['user']}:{config_login['password']}@{config_login['host']}/{config_login['database']}", echo=True, pool_pre_ping=True)


Session_write = sessionmaker(bind=engine_write)
Session_memo = sessionmaker(bind=engine_memo)
Session_login = sessionmaker(bind=engine_login)


def create_table():

    Base_write.metadata.create_all(engine_write)
    Base_memo.metadata.create_all(engine_memo)
    Base_user.metadata.create_all(engine_login)


def post_data_to_write(data):
    try:

        now = datetime.utcnow()
        data['created_at'] = now
        data['updated_at'] = now

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


def delete_data_from_write(write_id):
    try:
        with Session_write() as session:
            write_instance = session.query(
                Write).filter_by(id=write_id).first()

            if write_instance:
                session.delete(write_instance)
                session.commit()
                print(f"Data with id={write_id} deleted successfully")
            else:
                print(f"No data found with id={write_id}")
    except Exception as e:
        print(f"Error deleting data: {e}")


def post_data_to_cate(data):
    try:
        with Session_write() as session:
            cate_instance = Category(**data)
            session.add(cate_instance)
            session.commit()
    except Exception as e:
        print(f"Error adding data: {e}")


def delete_data_from_cate(category_name):
    try:
        with Session_write() as session:
            cate_instance = session.query(
                Category).filter_by(category=category_name).first()

            if cate_instance:
                session.delete(cate_instance)
                session.commit()
                print(f"Data with name={category_name} deleted successfully")
            else:
                print(f"No data found with name={category_name}")
    except Exception as e:
        print(f"Error deleting data: {e}")


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

        if memo_instance:
            for key, value in data.items():
                setattr(memo_instance, key, value)

            # 세션 커밋
            session.commit()
            print(f"Data with id={memo_id} updated successfully")
        else:
            print(f"No data found with id={memo_id}")

    except Exception as e:
        print(f"Error updating data: {e}")
        # 에러 발생 시 롤백
        session.rollback()
    finally:
        # 세션 닫기
        session.close()


def delete_data_from_memo(memo_id):
    try:
        with Session_memo() as session:
            memo_instance = session.query(Memo).filter_by(id=memo_id).first()

            if memo_instance:
                session.delete(memo_instance)
                session.commit()
                print(f"Data with id={memo_id} deleted successfully")
            else:
                print(f"No data found with id={memo_id}")
    except Exception as e:
        print(f"Error deleting data: {e}")


def post_data_from_memoAnno(data):
    try:
        with Session_memo() as session:

            memo_comment = data.get('memoComment')
            new_annotation = data.get('memoAnnotation')
            memo_instance = session.query(Memo).filter_by(
                memoComment=memo_comment).first()
            annotation_list = json.loads(memo_instance.memoAnnotation)

            annotation_list.append(new_annotation)
            updated_annotation = json.dumps(annotation_list)
            memo_instance.memoAnnotation = updated_annotation
            session.commit()

    except Exception as e:
        print(f"Error adding data: {e}")


def update_data_from_memoAnno(data):
    try:
        with Session_memo() as session:
            memo_id = data.get('id')
            update_annotation_content = data.get('memoAnno')
            update_annotation_index = data.get('corrAnnotationKeys')

            memo_instance = session.query(Memo).filter_by(id=memo_id).first()
            annotation_list = json.loads(memo_instance.memoAnnotation)

            annotation_list[update_annotation_index] = update_annotation_content
            updated_annotation = json.dumps(annotation_list)
            memo_instance.memoAnnotation = updated_annotation
            session.commit()
    except Exception as e:
        print(f"Error update memo: {e}")


def delete_data_from_memoAnno(anno_id, corrAnnotationKeys):
    try:
        with Session_memo() as session:
            memo_instance = session.query(Memo).filter_by(id=anno_id).first()
            annotation_list = json.loads(memo_instance.memoAnnotation)

            del annotation_list[corrAnnotationKeys]
            updated_annotation = json.dumps(annotation_list)
            memo_instance.memoAnnotation = updated_annotation
            session.commit()
            print("Annotation deleted successfully.")

    except Exception as e:
        print(f"Error deleting data: {e}")


def post_data_from_book(data):
    try:
        with Session_memo() as session:
            book_instance = Book(**data)
            session.add(book_instance)
            session.commit()
    except Exception as e:
        print(f"Error adding data: {e}")


def delete_data_from_book(memoSource):
    try:
        with Session_memo() as session:
            memo_instance = session.query(Book).filter_by(
                memoSource=memoSource).first()

            if memo_instance:
                session.delete(memo_instance)
                session.commit()
                print(
                    f"Data with memoSource={memoSource} deleted successfully")
            else:
                print(f"No data found with memoSource={memoSource}")
    except Exception as e:
        print(f"Error deleting data: {e}")


def hash_password(password):
    password_bytes = password.encode('utf-8')
    hashed_password = hashlib.sha256(password_bytes).hexdigest()

    return hashed_password


def post_data_from_pwd(data):

    try:
        session = Session_login()
        username = data.get('username_v')
        password = data.get('userpassword_v')
        user = session.query(User).filter_by(username=username).first()

        if user and user.password == hash_password(password):
            user_info = {
                "username": user.username,
                "authority": user.authority
            }
            return user_info
        else:
            return False

    except Exception as e:
        print(f"Error authenticating user: {e}")
        return 'Error occurred while authenticating user', 500

    finally:
        session.close()


def get_user_info_from_db(data):
    try:
        session = Session_login()
        username = data.get('username_v')
        user = session.query(User).filter_by(username=username).first()

        if user:
            user_info = {
                "username": user.username,
                "authority": user.authority
            }
            return user_info
        else:
            return None  # False 대신 None 반환, 없을 때 처리 일관성 유지

    except Exception as e:
        print(f"Error authenticating user: {e}")
        # 오류 발생 시 JSON 형식의 오류 메시지 반환
        return {"error": "Error occurred while authenticating user"}, 500

    finally:
        session.close()


def check_id_in_database(new_username):
    session = Session_login()
    try:
        user = session.query(User).filter_by(username=new_username).first()
        return user is not None
    finally:
        session.close()


def post_data_signup(data):
    session = Session_login()
    try:

        newUsername = data.get("id")

        newUserpassword = data.get("password")
        hashed_password = hash_password(newUserpassword)

        authority = 1

        new_user = User(username=newUsername,
                        password=hashed_password, authority=authority)

        session.add(new_user)
        session.commit()
        return {"message": "회원가입이 성공적으로 완료되었습니다."}

    except Exception as e:
        session.rollback()
        print(f"Error: {e}")
        return {"error": "회원가입 중 오류가 발생했습니다."}

    finally:
        session.close()


# 일단 주석 처리
# if __name__ == '__main__':
#     create_table()

#     data = {'title': 'Example Title', 'subTitle': 'Example Subtitle',
#             'content': 'Example Content', 'keywords': 'Example Keyword'}

#     post_data_from_write(data)
#     post_data_from_memo(data)
#     update_data_from_write(data)
#     update_data_from_memo(data)
