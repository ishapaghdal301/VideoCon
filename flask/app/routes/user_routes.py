from flask import Blueprint, jsonify, request, session
from app.services.user_services import UserService
from app.models.user_model import User
import bcrypt

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if 'password1' not in data or 'password2' not in data:
        return jsonify({'error': 'Password and Confirm Password are required'}), 400
    if data['password1'] != data['password2']:
        return jsonify({'error': 'Password and Confirm Password do not match'}), 400
    
    # Hash the password before storing it
    hashed_password = bcrypt.hashpw(data['password1'].encode('utf-8'), bcrypt.gensalt())
    
    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        username=data['username'],
        password=hashed_password
    )

    existing_user_email = UserService.get_user_by_email(user.email)
    existing_user_username = UserService.get_user_by_username(user.username)

    if existing_user_email:
        return jsonify({'error': 'Email already exists'}), 400
    if existing_user_username:
        return jsonify({'error': 'Username already exists'}), 400

    user = UserService.create_user(user.first_name, user.last_name, user.email, user.username, user.password)
    return jsonify({'message': 'Registration successful', 'user': user.to_json()}), 200

@user_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    
    if not (email or username) or not password:
        return jsonify({'error': 'Email/Username and password are required'}), 400
    
    user = None
    if email:
        user = UserService.get_user_by_email(email)
    elif username:
        user = UserService.get_user_by_username(username)

    if user and bcrypt.checkpw(password.encode('utf-8'), user.password):
        session['email'] = email
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401
