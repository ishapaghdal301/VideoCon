from flask import Blueprint, jsonify, request, session
from app.services.user_services import UserService
from app.models.user_model import User

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    # print(data)
    users = User(data['first_name'], data['last_name'], data['email'], data['password1'])
    if data['password1'] != data['password2']:
        return jsonify({'error': 'Password and Confirm Password are not same'}), 400
    if not all([users.first_name, users.last_name, users.email, users.password]):
        return jsonify({'error': 'Missing required fields'}), 400
    
    existing_user = UserService.get_user_by_email(users.email)
    if existing_user:
        return jsonify({'error': 'Email already exists'}), 400

    user = UserService.create_user(users.first_name, users.last_name, users.email, users.password)
    return jsonify({'message': 'Registration successful', 'user': user.to_json()}), 200

@user_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    
    user = UserService.get_user_by_email(email)
    if user and user.password == password:
        session['email'] = email
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
