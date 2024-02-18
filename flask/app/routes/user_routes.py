from flask import Blueprint, jsonify, request
from app.services.user_services import UserService
from app.models.user_model import User
import bcrypt
import random
import secrets
from app.services.send_email import send_email

user_bp = Blueprint('user_bp', __name__)

def generate_otp():
    return ''.join(random.choices('0123456789', k=6))

def generate_private_key(length=32):
    """Generate a random private key."""
    return secrets.token_urlsafe(length)

@user_bp.route('/api/register', methods=['POST'])
def register():
    data = request.json
    if 'password1' not in data or 'password2' not in data:
        return jsonify({'error': 'Password and Confirm Password are required'}), 400
    if data['password1'] != data['password2']:
        return jsonify({'error': 'Password and Confirm Password do not match'}), 400
    
    hashed_password = bcrypt.hashpw(data['password1'].encode('utf-8'), bcrypt.gensalt())
    print(data)
    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data['email'],
        username=data['username'],
        password=hashed_password
    )

    existing_user_email = UserService.get_user_by_email(data['email'])
    existing_user_username = UserService.get_user_by_username(data['username'])
    
    if existing_user_email:
        if existing_user_username.otp != None:
            UserService.delete_user(data['email'])
        else:
            return jsonify({'error': 'Email already exists'}), 400
    if existing_user_username:
        if existing_user_username.otp != None:
            UserService.delete_user(data['email'])
        else:
            return jsonify({'error': 'Username already exists'}), 400
    
    OTP = generate_otp()
    print(OTP)
    user.otp = OTP
    print(user)
    UserService.create_user(user.first_name, user.last_name, user.email, user.username, user.password, user.otp)
    send_email(data['email'], 'Verification OTP', f'Your verification OTP is: {OTP}')

    return jsonify({'message': 'Verification OTP sent to your email'}), 200


@user_bp.route('/api/verify_otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')

    if not (email and otp):
        return jsonify({'error': 'Email and OTP are required'}), 400

    user = UserService.get_user_by_email(email)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    if user.otp != otp:
        UserService.delete_user(email)
        return jsonify({'error': 'Invalid OTP. User removed from database'}), 400
    
    user.otp = None
    UserService.update_user(email, user.otp)
    
    return jsonify({'message': 'OTP verification successful'}), 200


@user_bp.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email_or_username = data.get('emailOrUsername')
    password = data.get('password')
    
    if not (email_or_username and password):
        return jsonify({'error': 'Email/Username and password are required'}), 400
    
    user = None
    if '@' in email_or_username:
        user = UserService.get_user_by_email(email_or_username)
    else:
        user = UserService.get_user_by_username(email_or_username)

    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Generate OTP and send it via email
    OTP = generate_otp()
    send_email(user.email, 'Login OTP', f'Your login OTP is: {OTP}')
    
    # Generate JWT token using private key
    private_key = generate_private_key()  # Generate private key
    token = jwt.encode({'user_id': user.id}, private_key, algorithm='HS256')
    
    # Save private key to user object (if necessary)
    user.private_key = private_key
    UserService.update_user(user)  # Update user in the database with new private key
    
    flask_session['user_id'] = user.id  # Assuming you are using session to maintain login state

    return jsonify({'message': 'OTP sent to your email', 'jwt_token': token}), 200
