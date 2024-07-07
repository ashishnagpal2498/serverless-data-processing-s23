import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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
//console.log('reached...');
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
//firestore.settings({ experimentalForceLongPolling: true, merge: true });


export function showMessagesPreview() {
    const currentUserEmail = "124@gmail.com"; // Replace with logged in user email
    const chatMessagesCollection = collection(firestore, 'chat-messages');
    getDocs(chatMessagesCollection)   
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
            console.log(other_recipient_Id,currentUserEmail);
            if (relevantMessages.length > 0) {
                // Display only the last relevant message for simplicity
                const lastMessage = relevantMessages[relevantMessages.length - 1].content;
                const other_recipient_Id = relevantMessages[relevantMessages.length - 1].sender_id;

                const messageButton = document.createElement('button');
                messageButton.textContent = `${other_recipient_Id}: ${lastMessage}`;

                if(other_recipient_Id === currentUserEmail)
                    other_recipient_Id = relevantMessages[relevantMessages.length - 1].receiver_id;
                
                messageButton.classList.add('messageButton');
                messageButton.onclick = () => goToChat(other_recipient_Id, currentUserEmail);
                messagesPreview.appendChild(messageButton);
            }
        }); 
    })
    .catch(error => {
        console.error("Error fetching messages:", error);
    });
}

function goToChat(senderId, currentUserId) {
    window.location.href = `chat.html?other_recipientId=${encodeURIComponent(other_recipient_Id)}&currentUserId=${encodeURIComponent(currentUserId)}`;
}