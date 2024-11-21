from abc import ABCMeta, abstractmethod
from google.oauth2 import id_token
from google.auth.transport import requests

class BaseAuthAdapter(metaclass=ABCMeta):

    def __init__(self):
        pass

    @abstractmethod
    def validate_token(self, token: str):
        pass


class AuthAdapter(BaseAuthAdapter):
    def __init__(self, client_id: str):
        self.client_id = client_id
        self.google_request = requests.Request()

    def validate_token(self, token: str):
        id_token.verify_oauth2_token(token, self.google_request, self.client_id)