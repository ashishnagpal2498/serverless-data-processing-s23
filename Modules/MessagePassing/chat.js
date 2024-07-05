const firebaseConfig = {
    apiKey: "AIzaSyDLTPrS8gcvCW76TOEhBky7NTMSGt01VfU",
    authDomain: "serverless-project-427212.firebaseapp.com",
    databaseURL: "https://serverless-project-427212-default-rtdb.firebaseio.com",
    projectId: "serverless-project-427212",
    storageBucket: "serverless-project-427212.appspot.com",
    messagingSenderId: "996482586248",
    appId: "1:996482586248:web:8201f151974b3e13f4f13d",
    measurementId: "G-5XXESZCV71"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const database = firebase.database();
firestore.settings({ experimentalForceLongPolling: true, merge: true });

// Example: Replace with actual current user email and chat partner email
let currentUserEmail = "user1@outlook.com";
let chatWithEmail = "user2@outlook.com";

document.getElementById('chatWith').textContent = chatWithEmail;

const chatPath = generateChatPath(currentUserEmail, chatWithEmail);
const messagesRef = database.ref('messages/' + chatPath);

// Listen for new messages
messagesRef.on('child_added', (snapshot) => {
    const message = snapshot.val();
    const li = document.createElement('li');
    li.textContent = message.sender + ": " + message.text;
    document.getElementById('messages').appendChild(li);
});

// Send the message
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (text) {
        const message = {
            text,
            sender: currentUserEmail,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        messagesRef.push(message);
        saveMessageToFirestore(chatWithEmail, currentUserEmail, text);
        input.value = '';
    }
}

// Function to save message to Firestore
function saveMessageToFirestore(toId, fromId, messageContent) {
    const chatMessagesRef = firestore.collection('chat-messages');
    const chatPath = generateChatPath(fromId, toId);
    const messageRef = chatMessagesRef.doc(chatPath);

    const timestamp = new Date();

    const messageData = {
        content: messageContent,
        sender_id: fromId,
        receiver_id: toId,
        timestamp: timestamp
    };

    messageRef.get().then(doc => {
        if (!doc.exists) {
            return messageRef.set({
                messages: [messageData]
            });
        } else {
            const currentMessages = doc.data().messages || [];
            currentMessages.push(messageData);
            return messageRef.update({
                messages: currentMessages
            });
        }
    }).then(() => {
        console.log("Message successfully written to Firestore!");
    }).catch((error) => {
        console.error("Error writing message to Firestore: ", error);
    });
}

// Helper function to generate a consistent chat path for both users
function generateChatPath(user1, user2) {
    return [btoa(user1), btoa(user2)].sort().join('_');
}
