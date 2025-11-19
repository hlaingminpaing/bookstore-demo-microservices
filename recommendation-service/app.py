from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# Mock database of special recommendations
recommendations = [
    {"id": 101, "title": "Automate the Boring Stuff", "author": "Al Sweigart", "price": 25.00, "category": "Python", "cover": "green", "description": "Practical programming for total beginners."},
    {"id": 102, "title": "Python Crash Course", "author": "Eric Matthes", "price": 22.50, "category": "Python", "cover": "yellow", "description": "A hands-on, project-based introduction to programming."}
]

@app.route('/api/recommendations', methods=['GET'])
def get_recommendation():
    # Return a random book from the list
    book = random.choice(recommendations)
    return jsonify(book)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "recommendation-service-python"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)