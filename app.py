import os
from flask import Flask, jsonify, request
from googleapiclient.discovery import build
from dotenv import load_dotenv
from flask_cors import CORS


def search_youtube(message):
    # TO:DO: izvuci entitete iz poruke i pretrazi youtube
    return "dobijeni url"


app = Flask(__name__)
CORS(app)

load_dotenv()
youtube_api_key = os.getenv("YOUTUBE_API_KEY")

youtube = build("youtube", "v3", developerKey=youtube_api_key)


@app.route("/", methods=["POST"])
def handle_request():
    # ruta koja ce se pozivati sa front-a
    user_input = request.json.get("message")
    response = search_youtube(user_input)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
