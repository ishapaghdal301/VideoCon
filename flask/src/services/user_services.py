from src.models.user import User

class UserService:
    @staticmethod
    def create_user(first_name, last_name, email, password):
        user = User(first_name=first_name, last_name=last_name, email=email, password=password)
        user.save()
        return user
    
    @staticmethod
    def get_user_by_email(email):
        return User.objects(email=email).first()