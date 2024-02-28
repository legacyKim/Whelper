import os


def db_config():

    db_config_01 = {
        "host": os.environ.get("MYSQL_HOST"),
        "user": os.environ.get("MYSQL_USER"),
        "password": os.environ.get("MYSQL_PASSWORD"),
        'database': os.environ.get("MYSQL_DATABASE_write"),
    }

    db_config_02 = {
        "host": os.environ.get("MYSQL_HOST"),
        "user": os.environ.get("MYSQL_USER"),
        "password": os.environ.get("MYSQL_PASSWORD"),
        'database': os.environ.get("MYSQL_DATABASE_memo"),
    }

    return db_config_01, db_config_02
