const chatContainer = document.querySelector('.chat-container');
const chatMessagesContainer = chatContainer.querySelector('.chat-messages-container');
const chatInput = chatContainer.querySelector('.chat-input');
const chatSendBtn = chatContainer.querySelector('.chat-send-btn');

let botReplied = true;
function addChatbotMessage(message, isBot)
{
    const messageElem = document.createElement('div');
    messageElem.classList.add('chat-message');

    if (isBot && !botReplied)
    {
        const loadingElement = document.createElement('div');
        loadingElement.classList.add('loading-dots');

        const loadingDot1 = document.createElement('span');
        const loadingDot2 = document.createElement('span');
        const loadingDot3 = document.createElement('span');

        loadingElement.appendChild(loadingDot1);
        loadingElement.appendChild(loadingDot2);
        loadingElement.appendChild(loadingDot3);

        messageElem.appendChild(loadingElement);

        chatMessagesContainer.appendChild(messageElem);

        console.log("waiting response..");
        
        setTimeout(() =>
        {
            console.log("responded");
            messageElem.classList.add('bot-message');
            messageElem.textContent = message;
            chatMessagesContainer.appendChild(messageElem);
            botReplied = true;
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }, 1500);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    else
    {
        if (botReplied)
        {
            botReplied = false;
            messageElem.classList.add('user-message');
            messageElem.textContent = message;
            chatMessagesContainer.appendChild(messageElem);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            chatInput.value = '';
        }
    }
}


function respondToMessage(message)
{
    // Replace this with your own logic to generate bot response
    const responses = [
        "How can I help you?",
        "I'm sorry, I didn't understand.",
        "Can you please rephrase that?",
        "I don't get what you say.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

chatSendBtn.addEventListener("click", () =>
{
    const inputMessage = chatInput.value;
    if (inputMessage)
    {
        addChatbotMessage(inputMessage, false);
        const botResponse = respondToMessage(inputMessage);
        addChatbotMessage(botResponse, true);
    }
});