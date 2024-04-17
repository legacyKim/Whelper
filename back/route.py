from flask import Flask, request, jsonify
from flask_cors import CORS
from db_connector import get_data_from_write, get_data_from_memo
from db_operator import post_data_to_write, update_data_from_write, delete_data_from_write, post_data_to_cate, post_data_from_memo, update_data_from_memo, delete_data_from_memo, post_data_from_memoAnno, update_data_from_memoAnno, delete_data_from_memoAnno, post_data_from_book, delete_data_from_book, post_data_from_pwd

import json

app = Flask(__name__)
CORS(app, resources={
     r'*': {'origins': 'http://localhost:3000'}}, supports_credentials=True)


@app.route('/components/WriteList', methods=['GET'])
def get_data_WriteList():
    results = get_data_from_write()
    writeList, cateList = results[0], results[1]

    try:
        data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/components/Write', methods=['POST'])
def post_data_WriteList():
    try:
        data = request.get_json()
        result = post_data_to_write(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/components/WriteCorrect', methods=['POST'])
def update_data_WriteList():
    try:
        data = request.get_json()
        write_id = data['db_id']

        result = update_data_from_write(data, write_id)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/components/Search', methods=['GET'])
def get_data_to_Search():
    results = get_data_from_write()
    writeList, cateList = results[0], results[1]

    try:
        data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/components/Category', methods=['GET'])
def get_data_to_cate():
    results = get_data_from_write()
    writeList, cateList = results[0], results[1]

    try:
        data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/components/Category', methods=['POST'])
def post_data_cate():
    try:
        data = request.get_json()
        result = post_data_to_cate(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/components/WriteCorrect/cate', methods=['POST'])
def post_data_cate_in_correct():
    try:
        data = request.get_json()
        result = post_data_to_cate(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/components/WriteView/<int:id>', methods=['DELETE'])
def delete_data_WriteList(id):
    try:
        result = delete_data_from_write(id)
        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


# @app.route('/')
@app.route('/components/Memo', methods=['GET'])
def get_data_memo():
    results = get_data_from_memo()
    memoList, bookList = results[0], results[1]

    try:
        data = {'memo': json.loads(memoList), 'book': json.loads(bookList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/components/Memo', methods=['POST'])
def post_data_memo():
    try:
        data = request.get_json()

        if 'memoAnnotation' in data and isinstance(data['memoAnnotation'], list):
            data['memoAnnotation'] = str(data['memoAnnotation'])

        result = post_data_from_memo(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling memo post request'}), 500


@app.route('/components/Memo/update', methods=['POST'])
def update_data_memo():
    try:
        data = request.get_json()
        memo_id = data['id']

        result = update_data_from_memo(data, memo_id)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/components/Memo/<int:id>', methods=['DELETE'])
def delete_data_Memo(id):
    try:
        result = delete_data_from_memo(id)
        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


@app.route('/components/Memo/anno', methods=['POST'])
def post_data_memoAnno():
    try:
        data = request.get_json()
        result = post_data_from_memoAnno(data)

        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling memo post request'}), 500


@app.route('/components/Memo/updateAnno', methods=['POST'])
def update_data_memoAnno():
    try:
        data = request.get_json()
        result = update_data_from_memoAnno(data)

        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling memo post request'}), 500


@app.route('/components/Memo/<int:id>/<int:corrAnnotationKeys>', methods=['DELETE'])
def delete_data_memoAnno(id, corrAnnotationKeys):
    try:
        result = delete_data_from_memoAnno(id, corrAnnotationKeys)

        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


@app.route('/components/Memo/book', methods=['POST'])
def post_data_book():
    try:
        data = request.get_json()
        result = post_data_from_book(data)

        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling memo post request'}), 500


@app.route('/components/Memo/<memoSource>', methods=['DELETE'])
def delete_data_book(memoSource):
    try:
        result = delete_data_from_book(memoSource)
        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


@app.route('/login', methods=['POST'])
def post_data_login():
    try:
        data = request.get_json()
        result = post_data_from_pwd(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling memo post request'}), 500


if __name__ == '__main__':
    app.run(debug=True)
