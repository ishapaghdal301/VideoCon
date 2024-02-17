from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb+srv://ISMM:ismm@interviewmap.obh2ylj.mongodb.net/interviewMap'
app.secret_key = 'your_secret_key'

mongo = PyMongo(app)

from app.routes.user_routes import user_bp
app.register_blueprint(user_bp)
