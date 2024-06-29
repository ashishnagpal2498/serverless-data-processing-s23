import base64
import functions_framework
import json
from google.cloud import firestore
import random
import boto3

aws_region = 'us-east-1'
dynamodb = boto3.resource('dynamodb', region_name=aws_region)
table_arn = 'arn:aws:dynamodb:us-east-1:440595714051:table/users'

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
        db = firestore.Client(database = 'dbmessaging')
        selected_agent = get_property_agent(message_data['propertyId'])
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

#get_property_agent(1)