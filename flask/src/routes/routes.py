from flask import jsonify, request, session
from app import app, mongo
from src.services.user_services import UserService

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    print(data)
    users = mongo.db.users
    
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']
    password = data['password']
    
    if not all([first_name, last_name, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    existing_user = UserService.get_user_by_email(email)
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400

    user = UserService.create_user(first_name, last_name, email, password)
    return jsonify({'message': 'Registration successful', 'user': user.to_json()}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user_collection = mongo.db.users
    user = user_collection.find_one({'email': email})
    # if user and check_password_hash(user['password'], password):
    if user and user['password'] == password:
        session['email'] = email
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
