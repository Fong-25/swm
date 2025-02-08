const openChat = document.getElementById('open-chat');
const chat = document.querySelector('.chat')

openChat.addEventListener('click', (e) => {
    chat.classList.toggle('open');
});