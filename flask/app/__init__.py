from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)
app.config['MONGO_URI'] = os.getenv('MONGO_URI')
app.secret_key = 'your_secret_key'

mongo = PyMongo(app)

from app.routes.user_routes import user_bp
app.register_blueprint(user_bp)
