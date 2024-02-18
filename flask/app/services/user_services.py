from app.models.user_model import User
from app import mongo

class UserService:
    @staticmethod
    def create_user(first_name, last_name, email, username, password, otp=None):
        users = mongo.db.users
        user_data = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'username': username,
            'password': password,
            'otp': otp
        }
        result = users.insert_one(user_data)
        return User(first_name, last_name, email, username, password, otp)

    @staticmethod
    def get_user_by_email(email):
        users = mongo.db.users
        user_data = users.find_one({'email': email})
        if user_data:
            return User(user_data['first_name'], user_data['last_name'], user_data['email'], user_data['username'], user_data['password'], user_data.get('otp'))
        return None

    @staticmethod
    def get_user_by_username(username):
        users = mongo.db.users
        user_data = users.find_one({'username': username})
        if user_data:
            return User(user_data['first_name'], user_data['last_name'], user_data['email'], user_data['username'], user_data['password'], user_data.get('otp'))
        return None

    @staticmethod
    def delete_user(identifier):
        users = mongo.db.users
        query = {'$or': [{'email': identifier}, {'username': identifier}]}
        result = users.delete_one(query)
        return result.deleted_count > 0
    
    @staticmethod
    def update_user(email, otp):
        users = mongo.db.users
        query = {'email': email}
        update_data = {'$set': {'otp': otp}}
        result = users.update_one(query, update_data)
        return result.modified_count > 0
