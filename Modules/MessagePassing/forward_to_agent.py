import base64
import functions_framework
import json
from google.cloud import firestore

def persist_msg(message_data):
    try:
        db = firestore.Client(database = 'dbmessaging')
        selected_agent = 1
        db.collection('customerConcerns').add({
            'booking_reference': message_data['booking_reference'],
            'concern': message_data['concern'],
            'propertyId': message_data['propertyId'],
            'agent': selected_agent,
            'status': 'forwarded'
        })
    except Exception as e:
        print(f"Error logging to Firestore: {e}")


# Triggered from a message on a Cloud Pub/Sub topic.
@functions_framework.cloud_event
def forward_to_agent(cloud_event):
    pub_sub_msg = base64.b64decode(cloud_event.data["message"]["data"])
    message_data = json.loads(pub_sub_msg)
    persist_msg(message_data)

