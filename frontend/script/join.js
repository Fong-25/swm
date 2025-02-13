// In your index.js or a new room.js file
const createRoomBtn = document.getElementById('createRoom');
const joinRoomBtn = document.getElementById('joinRoom');

createRoomBtn.addEventListener('click', () => {
    window.location.hash = 'create';  // URL becomes yoursite.com#create
});

joinRoomBtn.addEventListener('click', () => {
    window.location.hash = 'join';    // URL becomes yoursite.com#join
});