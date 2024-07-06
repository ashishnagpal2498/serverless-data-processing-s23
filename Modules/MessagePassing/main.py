import base64
import functions_framework
import json
from google.cloud import firestore
import random
import boto3
from google.protobuf import timestamp_pb2

aws_region = 'us-east-1'
dynamodb = boto3.resource('dynamodb', region_name=aws_region)
table_arn = 'arn:aws:dynamodb:us-east-1:440595714051:table/users'

def generate_chat_path(user1_id, user2_id):
    sorted_ids = sorted([user1_id, user2_id])
    encoded_ids = [base64.b64encode(uid.encode()).decode() for uid in sorted_ids]
    return '_'.join(encoded_ids)

def get_property_agent(property_id):
    try:
        table_name = table_arn.split('/')[-1]       
        table = dynamodb.Table(table_name)
        
        response = table.scan(
            FilterExpression='user_role = :user_role  AND property_id = :property_id',
            ExpressionAttributeValues={
                ':user_role': 'property_agent',
                ':property_id': property_id
            }
        )        
        property_agents = response.get('Items', [])
        
        if property_agents:
            random_agent = random.choice(property_agents)
            return random_agent
        else:
            print("No property agent found.")
            return None
        
    except Exception as e:
        print(f"Error accessing DynamoDB table: {e}")
        return None

def persist_msg(message_data):
    try:
        agent_email = get_property_agent(message_data['propertyId'])['email']

        chat_path = generate_chat_path(message_data['senderEmailId'], agent_email)
        database = firestore.Client(database='(default)')

        chat_messages_ref = database.collection('chat-messages').document(chat_path)
        persist_msg = {
            'booking_reference': message_data['booking_reference'],
            'content': message_data['content'],
            'property_id': message_data['propertyId'],
            'receiver_id': agent_email,
            'sender_id' : message_data['senderEmailId'],
            'timestamp': timestamp_pb2.Timestamp().GetCurrentTime()
        }

        doc_snapshot = chat_messages_ref.get()
        if doc_snapshot.exists:
            messages = doc_snapshot.get('messages') or []
            messages.append(persist_msg)
            chat_messages_ref.update({'messages': messages})
        else:
            chat_messages_ref.set({'messages': [persist_msg]})

    except Exception as e:
        print(f"Error logging to Firestore: {e}")


# Triggered from a message on a Cloud Pub/Sub topic.
@functions_framework.cloud_event
def forward_to_agent(cloud_event):
    pub_sub_msg = base64.b64decode(cloud_event.data["message"]["data"])
    message_data = json.loads(pub_sub_msg)
    persist_msg(message_data)

#print(persist_msg({'propertyId':1,
#                   'senderEmailId':'customer5@outlook.com',
#                  'content':'electricity issues',
#                  'booking_reference':1232
#                  }))