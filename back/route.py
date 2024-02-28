from flask import Flask, jsonify
from flask_cors import CORS
from db_connector import get_data_from_write, get_data_from_memo

import json

app = Flask(__name__)
CORS(app)


# @app.route('/')
@app.route('/api/components/WriteList')
def get_data_WriteList():
    results = get_data_from_write()
    writeList, cateList = results[0], results[1]

    try:
        data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


# @app.route('/')
@app.route('/api/components/Memo')
def get_data_memo():
    results = get_data_from_memo()
    memoList, bookList = results[0], results[1]

    try:
        data = {'memo': json.loads(memoList), 'book': json.loads(bookList)}
        print(data)
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


if __name__ == '__main__':
    app.run(debug=True)
