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

firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const database = firebase.database();
firestore.settings({ experimentalForceLongPolling: true, merge: true });

function showMessagesPreview() {
    const currentUserEmail = "124@gmail.com"; // Replace with logged in user email

    firestore.collection('chat-messages')
    .get()
    .then(querySnapshot => {
        const messagesPreview = document.getElementById('messagesPreview');
        messagesPreview.innerHTML = '';

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const messages = data.messages || [];
            
            // Filter messages where receiver_id matches currentUserEmail
            const relevantMessages = messages.filter(message => {
                return message.receiver_id === currentUserEmail;
            });
            //console.log(messages, relevantMessages)
            if (relevantMessages.length > 0) {
                // Display only the last relevant message for simplicity
                const lastMessage = relevantMessages[relevantMessages.length - 1].content;
                const senderId = relevantMessages[relevantMessages.length - 1].sender_id;

                const messageButton = document.createElement('button');
                messageButton.textContent = `${senderId}: ${lastMessage}`;
                messageButton.classList.add('messageButton');
                messageButton.onclick = () => goToChat(senderId, currentUserEmail);
                messagesPreview.appendChild(messageButton);
            }
        }); 
    })
    .catch(error => {
        console.error("Error fetching messages:", error);
    });
}

function goToChat(senderId, currentUserId) {
    window.location.href = `chat.html?senderId=${encodeURIComponent(senderId)}&currentUserId=${encodeURIComponent(currentUserId)}`;
}