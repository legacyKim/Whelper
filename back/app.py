from flask import Flask, jsonify
from flask_cors import CORS
from db_connector import get_db_connection


app = Flask(__name__)
CORS(app)


@app.route('/components/Write')
def get_data():

    # 데이터를 가져와서 JSON 형식으로 반환
    data_from_db = get_data_from_db()
    data = {'data_from_db': data_from_db}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
