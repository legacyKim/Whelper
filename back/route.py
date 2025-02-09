import os
from flask import Flask, request, jsonify, session, make_response
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies, unset_jwt_cookies
from flask_cors import CORS
from db_connector import get_data_from_write, get_data_from_memo, get_data_from_user, get_data_from_notice
from db_operator import post_data_to_write, update_data_from_write, delete_data_from_write, update_to_write_view, post_data_to_cate, post_data_from_memo, update_data_from_memo, delete_data_from_memo, post_data_from_memoAnno, update_data_from_memoAnno, delete_data_from_memoAnno, delete_data_from_cate, post_data_from_book, delete_data_from_book, post_data_from_pwd, post_user_info, get_user_info_from_db, delete_user, check_id_in_database, post_data_signup, post_notice_info, update_data_from_notice
from send_email import send_email
from datetime import datetime, timedelta
import random
import smtplib
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
    writeList = json.loads(results[0])

    today = datetime.now()
    seven_days_ago = today - timedelta(days=7)

    filtered_write_data = []
    for item in writeList:
        try:
            updated_at = item.get('updated_at')

            if updated_at:
                updated_at_date = datetime.strptime(
                    updated_at, '%Y-%m-%dT%H:%M:%S')
                if updated_at_date >= seven_days_ago:
                    filtered_write_data.append(item)

        except KeyError as e:
            print(f"KeyError: {e}")
        except ValueError as e:
            print(f"ValueError: {e}")

    try:
        data = {
            'write': filtered_write_data,
        }
        return data
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


def process_write_data():
    writeList, cateList = get_data_from_write()

    try:
        write_data = json.loads(writeList)
        cate_data = json.loads(cateList)
        return write_data, cate_data
    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


def common_write_data(id=None):
    write_data, cate_data = process_write_data()

    if write_data is None:
        return jsonify({'error': 'Invalid JSON data'}), 500

    if id is not None:
        if id == 9999:
            write_data = write_data[-1]
        else:
            matching_data = next(
                (item for item in write_data if item['id'] == id), None)
            if matching_data:
                write_data = matching_data

    data = {'write': write_data, 'cate': cate_data}
    return jsonify(data)


@app.route('/api/WriteListPage', methods=['GET'])
def get_data_WriteList_page():

    write_data, cate_data = process_write_data()

    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    try:
        start = (page - 1) * limit
        end = start + limit
        paginated_write_data = write_data[start:end]

        data = {
            'write': paginated_write_data,
            'cate': cate_data,
            'currentPage': page,
            'totalPages': (len(write_data) + limit - 1) // limit,
        }

        return jsonify(data)

    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/WriteList', methods=['GET'])
def get_data_WriteList():
    return common_write_data()


@app.route('/api/WriteView/<int:id>', methods=['GET'])
def get_data_WriteView(id):
    return common_write_data(id)


@app.route('/api/AnnoLink', methods=['GET'])
def get_data_Annolink():
    return common_write_data()


@app.route('/api/WriteCorrect/<int:id>', methods=['GET'])
def get_data_WriteCorrect(id):
    return common_write_data(id)


@app.route('/api/WriteView/<int:id>/increment', methods=['POST'])
def increment_view(id):
    try:
        writeView = update_to_write_view(id)
        return jsonify({"id": id, "views": writeView}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/Write', methods=['POST'])
def post_data_WriteList():
    try:
        data = request.get_json()
        result = post_data_to_write(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/api/Write/memo', methods=['GET'])
def get_memodata_in_write():

    results = get_data_from_memo()
    memoList = json.loads(results[0])

    bookTitle = request.args.get('selectValue')
    filtered_memoList = [
        memo for memo in memoList if memo.get('memoSource') == bookTitle]

    try:
        data = {
            'memo': filtered_memoList,
        }
        return jsonify(data)

    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/Write', methods=['GET'])
def get_bookdata_in_write():

    results = get_data_from_memo()
    bookList = json.loads(results[1])

    try:
        data = {
            'book': bookList,
        }
        return jsonify(data)

    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/WriteCorrect', methods=['PUT'])
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
    writeList = json.loads(results[0])

    searchPageInput = request.args.get('searchPageInput')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    if searchPageInput:
        search_terms = searchPageInput.split()
        filtered_writeList = [
            write for write in writeList if any(
                search_term in write.get('content', '') for search_term in search_terms
            )
        ]
    else:
        filtered_writeList = []

    try:
        start = (page - 1) * limit
        end = start + limit
        paginated_write_data = filtered_writeList[start:end]

        data = {
            'write': paginated_write_data,
            'currentPage': page,
            'totalPages': (len(writeList) + limit - 1) // limit,
        }
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


@app.route('/api/cate/<path:cateLink>', methods=['POST'])
def post_data_cate(cateLink):
    try:
        data = request.get_json()
        result = post_data_to_cate(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/api/Category', methods=['DELETE'])
def delete_data_cate():
    try:
        data = request.get_json()
        category_name = data.get('category')
        if category_name:
            delete_data_from_cate(category_name)
            return jsonify({"message": f"Data with name='{category_name}' deleted successfully"}), 200
        else:
            return jsonify({"error": "Category name is required"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/WriteView/<int:id>', methods=['DELETE'])
def delete_data_WriteList(id):
    try:
        result = delete_data_from_write(id)
        return jsonify({'message': 'Data deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


@app.route('/api/WriteListCate', methods=['GET'])
def get_data_write_cate():

    results = get_data_from_write()
    writeList = json.loads(results[0])

    cateArr = request.args.get('cateArr')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    if cateArr != '[]':
        try:
            cateArr = json.loads(cateArr)
        except json.JSONDecodeError:
            return jsonify({'error': 'Invalid JSON format for cateArr'}), 400

        filtered_writeList = [
            write for write in writeList if any(
                cate in write.get('keywords', '') for cate in cateArr
            )
        ]
    else:
        filtered_writeList = []

    try:
        start = (page - 1) * limit
        end = start + limit
        paginated_write_data = filtered_writeList[start:end]

        data = {
            'write': paginated_write_data,
            'currentPage': page,
            'totalPages': (len(writeList) + limit - 1) // limit,
        }
        return jsonify(data)

    except json.decoder.JSONDecodeError as e:
        print(f"JSON Decode Error: {e}")
        return jsonify({'error': 'Invalid JSON data'}), 500


@app.route('/api/Memo', methods=['GET'])
def get_data_memo():
    results = get_data_from_memo()
    memoList, bookList = json.loads(results[0]), json.loads(results[1])

    bookTitle = request.args.get('bookTitle')

    try:
        data = {
            'memo': memoList,
            'book': bookList,
            'bookTitle': bookTitle
        }
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


@app.route('/api/Memo/update', methods=['PUT'])
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


@app.route('/api/userCheckRefresh', methods=['POST'])
@jwt_required(optional=True)
def usercheck_refresh():
    current_user = get_jwt_identity()
    if current_user:
        user_info = get_user_info_from_db({"username_v": current_user})

        if user_info and not isinstance(user_info, tuple):
            return jsonify({'info': user_info}), 200
        elif isinstance(user_info, tuple):
            return jsonify(user_info[0]), user_info[1]
        else:
            return jsonify({'message': 'User not found'}), 404
    else:
        return jsonify({'message': 'User not found'}), 404


@app.route('/api/admin/info', methods=['GET'])
def get_user_info():
    results = get_data_from_user()

    userInfo = json.loads(results)
    return jsonify(userInfo)


@app.route('/api/admin/info/auth', methods=['POST'])
def post_user_info_auth():
    data = request.get_json()
    results = post_user_info(data)
    return jsonify(results), 200


@app.route('/api/admin/info/userDel/<int:id>', methods=['DELETE'])
def delete_user_info(id):
    try:
        result = delete_user(id)
        return jsonify({'message': 'id deleted successfully'}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling delete request'}), 500


@app.route('/api/admin/Stats', methods=['GET'])
def get_writeList_stats():
    results = get_data_from_write()
    writeList = results[0]

    statsInfo = json.loads(writeList)
    return jsonify(statsInfo)


@app.route('/api/Notice', methods=['GET'])
def get_notice():
    limit = request.args.get('limit', type=int)
    notice = get_data_from_notice(limit)
    return jsonify(notice)


@app.route('/api/admin/Notice', methods=['POST'])
def post_notice():
    try:
        data = request.get_json()
        post_notice_info(data)

        return jsonify({'message': 'notice saved successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/Notice/update', methods=['POST'])
def post_Notice_update():
    try:
        data = request.get_json()

        result = update_data_from_notice(data)
        return jsonify(result), 201
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': 'Error handling write post request'}), 500


@app.route('/api/duplicateId', methods=['POST'])
def post_data_deplicId():
    try:
        data = request.get_json()
        new_username = data.get("newUsername_v")

        existing_user = check_id_in_database(new_username)

        if existing_user:
            return jsonify({'message': 'ID already exists'}), 200
        else:
            return jsonify({'message': 'Success'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/sendCertifyNum', methods=['POST'])
def send_certify_num():

    data = request.get_json()
    email = data.get("email")

    certify_num = str(random.randint(100000, 999999))

    certify_codes = {}
    certify_codes[email] = certify_num

    try:
        send_email(email, certify_num)
        return jsonify({"success": True, "certifyNum": certify_num}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route('/api/signup', methods=['POST'])
def signup():

    data = request.get_json()
    result = post_data_signup(data)

    return jsonify({'message': 'Success'}), 201 if "message" in result else 500


@app.route('/api/protected', methods=['GET'])
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


@app.route('/api/logout', methods=['POST'])
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
