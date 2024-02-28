from flask import Flask, jsonify
from flask_cors import CORS
from db_connector import get_data_from_write, get_data_from_memo

import json

app = Flask(__name__)
CORS(app)


@app.route('/')
# @app.route('/api/components/WriteList')
def get_data_WriteList():
    writeList, cateList = get_data_from_write()
    data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
    return jsonify(data)


# @app.route('/')
@app.route('/api/components/Memo')
def get_data_memo():
    memoList, bookList = get_data_from_memo()
    data = {'memo': json.loads(memoList), 'book': json.loads(bookList)}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
