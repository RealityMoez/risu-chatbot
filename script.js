const chatContainer = document.querySelector('.chat-container');
const chatMessagesContainer = chatContainer.querySelector('.chat-messages-container');
const chatInput = chatContainer.querySelector('.chat-input');
const chatSendBtn = chatContainer.querySelector('.chat-send-btn');

var loadingElement = document.createElement('div');


let botReplied = true;
let loading = false;

function addChatbotMessage(message, isBot)
{
    const messageElem = document.createElement('div');
    messageElem.classList.add('chat-message');

    if (isBot && !botReplied)
    {
        if (!loading)
        {
            loadingElement = document.createElement('div');
            loadingElement.classList.add('loading-dots');

            const loadingDot1 = document.createElement('span');
            const loadingDot2 = document.createElement('span');
            const loadingDot3 = document.createElement('span');

            loadingElement.appendChild(loadingDot1);
            loadingElement.appendChild(loadingDot2);
            loadingElement.appendChild(loadingDot3);
            
            messageElem.appendChild(loadingElement);

            chatMessagesContainer.appendChild(messageElem);

            loading = true;
        }

        setTimeout(() =>
        {
            if (loading)
            {
                messageElem.appendChild(loadingElement);
                messageElem.removeChild(loadingElement);
                loadingElement.remove();

                chatMessagesContainer.removeChild(chatMessagesContainer.lastChild);

                console.log("responded");
                messageElem.classList.add('bot-message');
                messageElem.textContent = message;
                chatMessagesContainer.appendChild(messageElem);
                botReplied = true;
                loading = false;
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            }
        }, 1800);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    else
    {
        if (botReplied)
        {
            messageElem.classList.add('user-message');
            messageElem.textContent = message;
            chatMessagesContainer.appendChild(messageElem);
            chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
            botReplied = false;
            chatInput.value = '';
        }
    }
}


function respondToMessage(message)
{
    // OpenAI GPT-3 response
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