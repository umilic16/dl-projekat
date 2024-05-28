import os
import spacy
from flask import Flask, jsonify, request
from googleapiclient.discovery import build
from dotenv import load_dotenv
from flask_cors import CORS


def search_youtube(message):
    entities = ner_model(message).ents
    if len(entities) > 0:
        entities = " ".join(str(ent) for ent in entities)

        yt_request = youtube.search().list(
            part="snippet",
            maxResults=1,
            q=entities,
            type="video",
        )
        response = yt_request.execute()
        if response["items"]:
            video_id = response["items"][0]["id"]["videoId"]
            return {
                "entities": entities,
                "link": f"https://www.youtube.com/watch?v={video_id}",
            }

    return None


app = Flask(__name__)
CORS(app)

ner_model = spacy.load("./named_entity_recognition/model")

load_dotenv()
youtube_api_key = os.getenv("YOUTUBE_API_KEY")

youtube = build("youtube", "v3", developerKey=youtube_api_key)


@app.route("/", methods=["POST"])
def handle_request():
    """
    This function handles the request from the frontend and returns the response.
    """
    user_input = request.json.get("message")
    response = search_youtube(user_input)
    return jsonify({"response": response})


if __name__ == "__main__":
    app.run(debug=True)
