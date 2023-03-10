const chatContainer = document.querySelector('.chat-container');
const chatMessagesContainer = chatContainer.querySelector('.chat-messages-container');
const chatInput = chatContainer.querySelector('.chat-input');
const chatSendBtn = chatContainer.querySelector('.chat-send-btn');

let botReplied = true;
function addChatbotMessage(message, isBot)
{
    // create the message element
    const messageElem = document.createElement('div');
    messageElem.classList.add('chat-message');

    if (isBot)
    {
        // add the message element to the chat container with a delay
        setTimeout(() =>
        {
            if (!botReplied)
            {
                messageElem.classList.add('bot-message');
                messageElem.textContent = message;
                chatMessagesContainer.appendChild(messageElem);
                botReplied = true;
                // scroll to the bottom of the chat container after adding the message
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }
        }, 1500);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    } 
    else
    {
        if (botReplied)
        {
            messageElem.classList.add('user-message');
            messageElem.textContent = message;
            chatMessagesContainer.appendChild(messageElem);
            // scroll to the bottom of the chat container after adding the message
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            botReplied = false;
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
