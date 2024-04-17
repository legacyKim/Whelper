import os
from dotenv import load_dotenv

load_dotenv()


def db_config():

    db_config_01 = {
        "host": os.environ.get("MYSQL_HOST"),
        "user": os.environ.get("MYSQL_USER"),
        "password": os.environ.get("MYSQL_PASSWORD"),
        'database': os.environ.get("MYSQL_DATABASE_WRITE"),
    }

    db_config_02 = {
        "host": os.environ.get("MYSQL_HOST"),
        "user": os.environ.get("MYSQL_USER"),
        "password": os.environ.get("MYSQL_PASSWORD"),
        'database': os.environ.get("MYSQL_DATABASE_MEMO"),
    }

    db_config_03 = {
        "host": os.environ.get("MYSQL_HOST"),
        "user": os.environ.get("MYSQL_USER"),
        "password": os.environ.get("MYSQL_PASSWORD"),
        'database': os.environ.get("MYSQL_DATABASE_LOGIN"),
    }

    return db_config_01, db_config_02, db_config_03
