from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = 'your_secret_key'  
app.config['MONGO_URI'] = 'mongodb+srv://ISMM:ismm@interviewmap.obh2ylj.mongodb.net/interviewMap'  
mongo = PyMongo(app)

from flask.run import routes
