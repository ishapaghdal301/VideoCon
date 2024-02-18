from flask import Blueprint, jsonify, request, session
from app.services.user_services import UserService
from app.models.user_model import User
import bcrypt
import random
import secrets

user_bp = Blueprint('user_bp', __name__)

# Function to generate a 4-digit OTP
def generateOTP():
    return ''.join(random.choices('0123456789', k=4))

# Function to generate a private key
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

    user = UserService.create_user(user.first_name, user.last_name, user.email, user.password, user.username)
    return jsonify({'message': 'Registration successful', 'user': user.to_json()}), 200

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
    OTP = generateOTP()
    sendOTPViaEmail(user.email, 'Login OTP', f'Your login OTP is: {OTP}')
    
    # Generate JWT token using private key
    private_key = generate_private_key()  # Generate private key
    token = jwt.encode({'user_id': user.id}, private_key, algorithm='HS256')
    
    # Save private key to user object (if necessary)
    user.private_key = private_key
    user.save()  # Assuming you have a method to save user changes
    
    session['user_id'] = user.id  # Assuming you are using session to maintain login state

    return jsonify({'message': 'OTP sent to your email', 'jwt_token': token}), 200

