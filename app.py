"""
Nishi Yadav Birthday Website
Flask backend - serves all pages
"""
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/hobbies')
def hobbies():
    return render_template('hobbies.html')

@app.route('/gallery')
def gallery():
    return render_template('gallery.html')

@app.route('/secret')
def secret():
    return render_template('secret.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
