import os


def db_config():

    db_config = {
        "host": os.environ.get("MYSQL_HOST"),
        "user": os.environ.get("MYSQL_USER"),
        "password": os.environ.get("MYSQL_PASSWORD"),
        'database1': os.environ.get("MYSQL_DATABASE_write"),
        'database2': os.environ.get("MYSQL_DATABASE_memo"),
    }

    return db_config
