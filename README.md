#  Fraud Detection System (SecureFlow AI)

![Python](https://img.shields.io/badge/Python-3.x-blue)
![Flask](https://img.shields.io/badge/Flask-Web%20App-green)
![Status](https://img.shields.io/badge/Status-Working-success)

## 📌Overview

This project is a **Fraud Detection Web Application** built using Flask. It simulates real-world transaction checks (like PhonePe/UPI apps) and classifies transactions as **Safe, Suspicious, or High Risk** based on different parameters.

The system uses rule-based logic to detect fraud by analyzing:

* Transaction amount
* Location
* Device type
* Time of transaction

## Features

* Real-time fraud detection
* Risk score calculation
* Transaction status (Low / Medium / High Risk)
* OTP verification suggestion for high-risk cases
* Transaction history tracking
* Random transaction simulation

## Technologies Used

* Python
* Flask (Backend)
* HTML/CSS (Frontend)
* Jinja2 Templates

##  How It Works

The system assigns a **risk score** based on conditions:

* High amount (>3000) → +40 risk
* Unknown/Dubai location → +30 risk
* New device → +20 risk
* Night time → +10 risk

### Risk Classification:

* **0–39 → Low Risk ✅ (Safe Transaction)**
* **40–69 → Medium Risk ⚠ (Suspicious)**
* **70+ → High Risk ⚠ (OTP Required)**

## Project Structure

```
Fraud-Detection/
│── app.py              # Main Flask application
│── templates/          # HTML files
│── static/             # CSS/JS files
│── transactions.db     # Database
│── requirements.txt    # Dependencies
│── README.md
```

## Installation

```
git clone https://github.com/your-username/fraud-detection.git
cd fraud-detection
pip install -r requirements.txt
```

## Run the Project

```
python app.py
```

Then open in browser:

```
http://localhost:5000
```

## Example Output

* Transaction Status: High Risk ⚠
* Message: OTP Verification Required
* Risk Score: 80

## Sample Report

The system can generate reports like:

* Fraud detected transactions with confidence score fileciteturn0file1

## Requirements

* Flask
* Gunicorn fileciteturn0file2

## 🔮 Future Improvements

* Use ML models instead of rule-based logic
* Connect with real payment APIs
* Add user authentication
* Improve UI similar to real banking apps

---

 If you like this project, give it a star!
