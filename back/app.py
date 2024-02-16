from flask import Flask, jsonify
from flask_cors import CORS
from db_connector import get_db_connection


app = Flask(__name__)
CORS(app)


@app.route('/src/components/Write')
def get_data():
    # 데이터를 가져와서 JSON 형식으로 반환
    data = {'key': 'value', 'number': 42}
    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
