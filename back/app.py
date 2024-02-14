from flask import Flask
from db_connector import get_db_connection

app = Flask(__name__)


@app.route('/')
def hello():
    return '오...'


if __name__ == '__main__':
    app.run(debug=True)
