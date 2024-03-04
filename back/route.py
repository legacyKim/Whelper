from flask import Flask, request, jsonify
from flask_cors import CORS
from db_connector import get_data_from_write, get_data_from_memo, post_data_from_write

import json

app = Flask(__name__)
CORS(app, resources={
     r'*': {'origins': 'http://localhost:3000'}}, supports_credentials=True)


# @app.route('/')
@app.route('/components/WriteList', methods=['GET'])
def get_data_WriteList():
    results = get_data_from_write()
    writeList, cateList = results[0], results[1]

    try:
        data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
        print(data)
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/components/Write', methods=['POST'])
def post_data_WriteList():
    try:
        data = request.get_json()
        result = post_data_from_write(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


# @app.route('/')
@app.route('/components/Memo', methods=['GET'])
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
