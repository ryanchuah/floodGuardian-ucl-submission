from flask import Flask, request, Response, Blueprint
from ibm_watson import AssistantV2, ApiException
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
import json
import os

assistant_app = Blueprint('assistant_app', __name__)
# Create Assistant service object.
authenticator = IAMAuthenticator(
    os.getenv('ASSISTANT_IAM_APIKEY'))  # replace with API key
assistant = AssistantV2(
    version='2020-09-24',
    authenticator=authenticator
)
assistant.set_service_url(os.getenv('ASSISTANT_URL'))
assistant_id = os.getenv('ASSISTANT_ID')  # replace with assistant ID


@assistant_app.route("/session")
def session():
    try:
        response = assistant.create_session(assistant_id).get_result()
        return response['session_id']
    except ApiException as ex:
        print("ERROR: Method failed with status code " +
              str(ex.code) + ": " + ex.message)
        return Response("Method failed: " + ex.message, status=ex.code)


@assistant_app.route("/message", methods=['POST'])
def message():
    data = json.loads(request.data)

    text = data['text']
    sessionid = data['sessionid']

    try:
        response = assistant.message(assistant_id, sessionid, input={
            'message_type': 'text', 'text': text
        })
        return response.get_result()['output']
    except ApiException as ex:
        print("ERROR: Method failed with status code " +
              str(ex.code) + ": " + ex.message)
        return Response("Method failed: " + ex.message, status=ex.code)
