const chatbotContainer = document.querySelector('.chatbot-container');
const chatbotMessageContainer = chatbotContainer.querySelector('.chatbot-message-container');
const chatbotInput = chatbotContainer.querySelector('.chatbot-input');
const chatbotSendBtn = chatbotContainer.querySelector('.chatbot-send-btn');

let botReplied = true;
function addChatbotMessage(message, isBot)
{
    // create the message element
    const messageElem = document.createElement('div');
    messageElem.classList.add('chatbot-message');

    if (isBot)
    {
        // add the message element to the chat container with a delay
        setTimeout(() =>
        {
            if (!botReplied)
            {
                messageElem.classList.add('bot-message');
                messageElem.textContent = message;
                chatbotMessageContainer.appendChild(messageElem);
                botReplied = true;
                // scroll to the bottom of the chat container after adding the message
                chatbotMessageContainer.scrollTop = chatbotMessageContainer.scrollHeight;
            }
        }, 1500);
        chatbotMessageContainer.scrollTop = chatbotMessageContainer.scrollHeight;

    } 
    else
    {
        if (botReplied)
        {
            messageElem.classList.add('user-message');
            messageElem.textContent = message;
            chatbotMessageContainer.appendChild(messageElem);
            // scroll to the bottom of the chat container after adding the message
            chatbotMessageContainer.scrollTop = chatbotMessageContainer.scrollHeight;
            botReplied = false;
            chatbotInput.value = '';
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

chatbotSendBtn.addEventListener("click", () =>
{
    const inputMessage = chatbotInput.value;
    if (inputMessage)
    {
        addChatbotMessage(inputMessage, false);
        const botResponse = respondToMessage(inputMessage);
        addChatbotMessage(botResponse, true);
    }
});
