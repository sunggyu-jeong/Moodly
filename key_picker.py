import jwt
import datetime
import os
from dotenv import load_dotenv

load_dotenv()

TEAM_ID   = os.environ['TEAM_ID']
CLIENT_ID = os.environ['CLIENT_ID']
KEY_ID    = os.environ['KEY_ID']


with open("AuthKey_72336Z68MU.p8") as f:
    private_key = f.read()

headers = {"kid": KEY_ID, "alg": "ES256"}
payload = {
    "iss": TEAM_ID,
    "iat": int(datetime.datetime.now().timestamp()),
    "exp": int((datetime.datetime.now() + datetime.timedelta(days=180)).timestamp()),
    "aud": "https://appleid.apple.com",
    "sub": CLIENT_ID
}

token = jwt.encode(payload, private_key, algorithm="ES256", headers=headers)
print(token)