import os
from flask import Flask, request, jsonify, session, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from flask_cors import CORS
from db_connector import get_data_from_write, get_data_from_memo
from db_operator import post_data_to_write, update_data_from_write, delete_data_from_write, post_data_to_cate, post_data_from_memo, update_data_from_memo, delete_data_from_memo, post_data_from_memoAnno, update_data_from_memoAnno, delete_data_from_memoAnno, post_data_from_book, delete_data_from_book, post_data_from_pwd

import json

app = Flask(__name__)

app.secret_key = os.getenv('SECRET_KEY', os.urandom(24))
app.config['JWT_SECRET_KEY'] = os.getenv(
    'JWT_SECRET_KEY', 'fallback_secret_key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = int(
    os.getenv('JWT_ACCESS_TOKEN_EXPIRES', 3600))
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token_cookie'
app.config['JWT_COOKIE_SECURE'] = True  # 개발 환경에서는 False, 프로덕션에서는 True
app.config['JWT_COOKIE_CSRF_PROTECT'] = True  # 필요에 따라 True로 설정
# app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_CSRF_CHECK_FORM'] = True  # 필요에 따라 True로 설정
jwt = JWTManager(app)

CORS(app, resources={
     r'*': {'origins': 'http://localhost:3000'}}, supports_credentials=True)

# CORS(app, resources={
#      r'*': {'origins': 'https://bambueong.net/'}}, supports_credentials=True)


@app.route('/api/date', methods=['GET'])
def get_data_WriteList_date():
    results = get_data_from_write()
    writeList = results[0]

    try:
        data = {'write': json.loads(writeList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/WriteList', methods=['GET'])
def get_data_WriteList():
    results = get_data_from_write()
    writeList, cateList = results[0], results[1]

    try:
        data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/Write', methods=['POST'])
def post_data_WriteList():
    try:
        data = request.get_json()
        result = post_data_to_write(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/api/WriteCorrect', methods=['POST'])
def update_data_WriteList():
    try:
        data = request.get_json()
        write_id = data['id']

        result = update_data_from_write(data, write_id)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/api/Search', methods=['GET'])
def get_data_to_Search():
    results = get_data_from_write()
    writeList, cateList = results[0], results[1]

    try:
        data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/Category', methods=['GET'])
def get_data_to_cate():
    results = get_data_from_write()
    writeList, cateList = results[0], results[1]

    try:
        data = {'write': json.loads(writeList), 'cate': json.loads(cateList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/Category', methods=['POST'])
def post_data_cate():
    try:
        data = request.get_json()
        result = post_data_to_cate(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/api/WriteCorrect/cate', methods=['POST'])
def post_data_cate_in_correct():
    try:
        data = request.get_json()
        result = post_data_to_cate(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/api/WriteView/<int:id>', methods=['DELETE'])
def delete_data_WriteList(id):
    try:
        result = delete_data_from_write(id)
        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


# @app.route('/')
@app.route('/api/Memo', methods=['GET'])
def get_data_memo():
    results = get_data_from_memo()
    memoList, bookList = results[0], results[1]

    try:
        data = {'memo': json.loads(memoList), 'book': json.loads(bookList)}
        return jsonify(data)
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/Memo', methods=['POST'])
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


@app.route('/api/Memo/update', methods=['POST'])
def update_data_memo():
    try:
        data = request.get_json()
        memo_id = data['id']

        result = update_data_from_memo(data, memo_id)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/api/Memo/<int:id>', methods=['DELETE'])
def delete_data_Memo(id):
    try:
        result = delete_data_from_memo(id)
        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


@app.route('/api/Memo/anno', methods=['POST'])
def post_data_memoAnno():
    try:
        data = request.get_json()
        result = post_data_from_memoAnno(data)

        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling memo post request'}), 500


@app.route('/api/Memo/updateAnno', methods=['POST'])
def update_data_memoAnno():
    try:
        data = request.get_json()
        result = update_data_from_memoAnno(data)

        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling memo post request'}), 500


@app.route('/api/Memo/<int:id>/<int:corrAnnotationKeys>', methods=['DELETE'])
def delete_data_memoAnno(id, corrAnnotationKeys):
    try:
        result = delete_data_from_memoAnno(id, corrAnnotationKeys)

        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


@app.route('/api/Memo/book', methods=['POST'])
def post_data_book():
    try:
        data = request.get_json()
        result = post_data_from_book(data)

        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling memo post request'}), 500


@app.route('/api/Memo/<memoSource>', methods=['DELETE'])
def delete_data_book(memoSource):
    try:
        result = delete_data_from_book(memoSource)
        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


@app.route('/api/Login', methods=['POST'])
def post_data_login():
    try:
        data = request.get_json()
        result = post_data_from_pwd(data)

        if result:
            session['user_name'] = result['username']
            session['user_authority'] = result['authority']

            access_token = create_access_token(identity=result['username'])
            response = jsonify({'info': result})
            set_access_cookies(response, access_token)
            return response

        else:
            return jsonify({'message': 'Invalid username or password'}), 401
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


@app.route('/login', methods=['GET'])
def login():
    if 'username' in session:
        return jsonify({'username': session['username'], 'authority': session['user_authority']})
    else:
        return jsonify({'message': 'User not logged in'}), 401


@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    session.pop('user_authority', None)

    response = make_response(
        jsonify({'message': 'Logout successful', 'success': True}))
    unset_jwt_cookies(response)
    response.set_cookie('user_id', '', expires=0)

    return response


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
    # app.run(host='127.0.0.1', port=5000, debug=True)
