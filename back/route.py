from flask import Flask, jsonify
from flask_cors import CORS
from db_connector import get_data_from_db

import json

app = Flask(__name__)
CORS(app)


@app.route('/api/components/WriteList')
def get_data():

    # 데이터를 가져와서 JSON 형식으로 반환
    writeList = get_data_from_db()

    # JSON 문자열을 파이썬 객체로 변환
    data = {'writeList': json.loads(writeList)}

    print(data)

    # jsonify 함수를 사용하여 JSON 응답 생성
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
