class User:
    def __init__(self, first_name, last_name, email, username, password, otp=None, jwt_token=None):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.username = username
        self.password = password
        self.otp = otp
        self.jwt_token = jwt_token

    def to_json(self):
        return {
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'username': self.username,
            'otp': self.otp,
            'jwt_token': self.jwt_token
        }
