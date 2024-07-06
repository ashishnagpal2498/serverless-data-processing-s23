import base64
import functions_framework
import json
from google.cloud import firestore
import random
import boto3
from google.protobuf import timestamp_pb2
import firebase_admin
from firebase_admin import credentials, db

aws_region = 'us-east-1'
dynamodb = boto3.resource('dynamodb', region_name=aws_region)
table_arn = 'arn:aws:dynamodb:us-east-1:440595714051:table/users'
service_account_info = {
  "type": "service_account",
  "project_id": "serverless-project-427212",
  "private_key_id": "00782b9c2b9adc0c481ad84f515432442c73111f",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCnQ4VLS03xunas\n2IYLXazVwzAs/Z7sSeEcY8Kn4/totCm7/+X2qMQxSSnX8nbFzos/j6AIuXKbIiSJ\nZxM0imqwUvG1h20uuM/OUMlIE9t+4hdjBwYZ2PNx2LJqsn0L1oj4dBHmRw54yIUn\ncLSmGbyFAIQOAIdqWHpnHOit6l+vewnbbn8YqQY4tUn6r4ebumS4IdBMI8lJgnYq\nux9watbrbq2rayKz0H0fs6Y7Fr2KGcrw8mZtKwqjprot0D2ZiyrjC2iKbquDgNgg\nyPA4gsFqicQ5gvnC6/DThfKldpbik2bOWskk1Kc9ydiPhmQTr22OzhV99ocFdBfQ\ncE1ESzzBAgMBAAECggEAFKyTWrGlojXGemnO87Ox68ATAdSdYp5lHTG1ezQCPLhc\nGjkwjvLgQSlGa0M0bBGyA3q4sKtfX45yTqt3Y7yiIEY4SxRAqhA820cAAhE2RbIj\nauGQ3vwCZzV+JBMIwsBTMMaD+d8ZilNapfvX0FoJA7WDHQnysvHZu0oG9owsJI/Q\nz0/UWLQwXQjVPTiQIvLsVggAEjUR2m7fqVecPbDEGDnMqEgQPJVek/d2s15/rHbQ\nQ900WcgNzgN/QACCxI9GasiYCx53iRRBDAQLKdAlmMB+Qx5j5unWkrjFrR9k1uEV\naMgAWUbHOK3O8LqR71WZDdtjDTzEmvWQM5PM0xV8uwKBgQDje0gbEYws6+zndr0h\n/MbUinYnJYFCMQVyThqEsx+CSRpMuGH7CRB/B7nnlo5uPydpuMlQwTiJbY0egTKZ\njoxwLJBhKvOHl/0esy+P2MzCU7a0EY6c50tw+odK71kYS38r7Fd+6Smo+hbVqHyk\nvoLBcu1AUFQTfQlRE5wXReRGgwKBgQC8O6DY6Q6gF2o3D0JTTn0C6hvI79zJMXac\nzDN1/c/BAEHMwqkQxBebUt3NaBXfvEJ8cJKhwJpUZWp81G1j6xMdL5U3o8phQoo/\nEZGAbIAVqCnsaNixk3Apvk+X9etflDisyMfbQBqplenaw/lnSjEBZBfLD7ZVpSON\nzOYmEcvsawKBgQDgsb8xbY3GOWuR3glHbwV+nx3B4RviI8W7eEZdWQkAifC+Y0n0\nyqlOsHUCugYKA7uMhAfmClUr+dfwj7FJWDKEAqDCOci+4HQXROrv7Tejo0jOaKEz\nfotYFz5X2D9q7fe5jQOHygtqa0zu0jP8DmndZwXOBwplDZaMTRBbNKAcvQKBgDxj\n3Qz6aKjQGlGj4aGcktr2hQeIfQtHhUh08yWt0pOXI4UwBtHMN86rXWHjPPFVEved\nnk2q31ioWOvHs3jVGILKm1MIh4uAr53gYxASv10zYI/qa2s9ZETgO+UDDwrRIQW+\nPPCItoUmBascKM4MrYBGvqN1XQhJPQjnbgdUuloVAoGBAKQC6kod7AeuvUtoJw3y\n/paGRuvoDEd56TJjt8Ni0no6Suea+VEkocwmJrASWgctMgLQdFM3fsC2gNbMqa32\nBvW0rP3E55wfgXHLgsv8cawnvAhgm2k1faul9rFdPz5T1B6Dxzvo/SjZF2C/Gv+i\nAr4037XxxNTY6xnnDq8XttDg\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-h1mpc@serverless-project-427212.iam.gserviceaccount.com",
  "client_id": "112745317027901288220",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h1mpc%40serverless-project-427212.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

cred = credentials.Certificate(service_account_info)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://serverless-project-427212-default-rtdb.firebaseio.com/'
})

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
        
        ref = db.reference('messages/'+chat_path)
        message = {
            'text': message_data['content'],
            'sender': message_data['senderEmailId'],
        }
        ref.push(message)
    except Exception as e:
        print(f"Error logging to Firestore: {e}")


# Triggered from a message on a Cloud Pub/Sub topic.
@functions_framework.cloud_event
def forward_to_agent(cloud_event):
    pub_sub_msg = base64.b64decode(cloud_event.data["message"]["data"])
    message_data = json.loads(pub_sub_msg)
    persist_msg(message_data)

print(persist_msg({'propertyId':1,
                   'senderEmailId':'customer4@outlook.com',
                   'content':'electricity issues',
                   'booking_reference':1232
                   }))