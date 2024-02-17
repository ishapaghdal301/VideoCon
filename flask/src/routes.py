from flask import jsonify, request, session
from app import app, mongo

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    users = mongo.db.users
    existing_user = users.find_one({'email': data['email']})
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400

    users.insert_one({
        'first_name': data['first_name'],
        'last_name': data['last_name'],
        'email': data['email'],
        'password': data['password1']  # Consider hashing the password
    })
    return jsonify({'message': 'Registration successful'}), 200

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
