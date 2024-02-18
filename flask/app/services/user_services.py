from app.models.user_model import User
from app import mongo

class UserService:
    @staticmethod
    def create_user(first_name, last_name, email, password, username):  # Add username parameter
        users = mongo.db.users
        user = User(first_name, last_name, email, username, password)  # Pass username to User constructor
        user_data = {'first_name': user.first_name, 'last_name': user.last_name, 'email': user.email, 'password': user.password, 'username': user.username}
        result = users.insert_one(user_data)
        return user
    
    @staticmethod
    def get_user_by_email(email):
        users = mongo.db.users
        user_data = users.find_one({'email': email})
        if user_data:
            user = User(user_data['first_name'], user_data['last_name'], user_data['email'], user_data['password'])
            return user
        return None

    @staticmethod
    def get_user_by_username(username):
        users = mongo.db.users
        user_data = users.find_one({'username': username})
        if user_data:
            user = User(user_data['first_name'], user_data['last_name'], user_data['email'], user_data['password'])
            return user
        return None

