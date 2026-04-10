from flask import Flask, request, jsonify

app = Flask(__name__)

print("🔥 App started")

@app.route('/')
def home():
    return "Home is working"

@app.route('/predict', methods=['POST'])
def predict():
    print("🔥 Predict API called")

    data = request.json

    exp = float(data['experience'])
    edu = float(data['education'])
    skills = float(data['skills'])

    result = exp * 10000 + edu * 5000 + skills * 2000

    return jsonify({
        "predicted_salary": result
    })

if __name__ == "__main__":
    app.run(debug=True, port=5001)