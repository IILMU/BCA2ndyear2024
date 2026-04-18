from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
    prediction = None

    if request.method == 'POST':
        try:
            exp = float(request.form['exp'])
            prediction = 20000 + (exp * 6000)   # better logic
        except:
            prediction = "Invalid input"

    return render_template('index.html', prediction=prediction)

if __name__ == "__main__":
    app.run(debug=True)