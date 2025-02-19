
const socket = io();

// const socket = io('http://localhost:3000');  //
const openChat = document.getElementById('open-chat');
const chat = document.querySelector('.chat');
const chatInput = chat.querySelector('input');
const messagesContainer = chat.querySelector('.messages-container');
const userListContainer = document.getElementById('user-list')

// Get username when page loads
let username;
while (!username) {
    username = prompt('Please enter your username');
    if (username) username = username.trim();
}

// Function to update the user list
function updateUserList(users) {
    userListContainer.innerHTML = '<strong>Users in room:</strong><br>' + users.join('<br>');
}

// toast for chat and join/left noti
function showToast(message) {
    Toastify({
        text: message,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(90deg, #0a0d67 0%, #0c18a4 50%)",
        },
    }).showToast();
}

// Register username with server
socket.emit('register_username', username, (response) => {
    if (!response.success) {
        alert(response.message);
        location.reload();
    }
});

// Check URL hash for room actions
function handleRoomActions() {
    const hash = window.location.hash;

    if (hash === '#create') {
        const roomId = prompt('Enter room ID to create:');
        if (roomId) {
            socket.emit('create_room', roomId, (response) => {
                if (!response.success) {
                    alert(response.message); // Maybe change this to Toastify
                    window.location.hash = '';
                }
                // add toast to this if create success
                else {
                    Toastify({
                        text: `Created room ${roomId} successfully`,
                        duration: 3000,
                        gravity: "bottom",
                        position: "right",
                        style: {
                            background: "linear-gradient(90deg, #0b6c0c 0%, #11980f 37%)",
                        },
                    }).showToast();
                }
            });
        }
        else {
            window.location.hash = '';  // reset hash if cancel
        }
    } else if (hash === '#join') {
        const roomId = prompt('Enter room ID to join:');
        if (roomId) {
            socket.emit('join_room', roomId, (response) => {
                if (!response.success) {
                    alert(response.message); // Maybe change this to Toastify
                    window.location.hash = '';
                }
                // add toast to this if join success
                else {
                    Toastify({
                        text: `Joined room ${roomId} successfully`,
                        duration: 3000,
                        gravity: "bottom",
                        position: "right",
                        style: {
                            background: "linear-gradient(90deg, #0b6c0c 0%, #11980f 37%)",
                        },
                    }).showToast();
                }
            });
        }
        else {
            window.location.hash = ''  // reset hash if cancel
        }
    }
}

// Listen for hash changes
window.addEventListener('hashchange', handleRoomActions);
// Check hash on initial load
handleRoomActions();

// Handle chat UI
openChat.addEventListener('click', (e) => {
    chat.classList.toggle('open');
});

// Send chat message
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        socket.emit('chat_message', chatInput.value.trim());
        chatInput.value = '';
    }
});

// Receive chat message
socket.on('chat_message', (data) => {
    // const messageDiv = document.createElement('div');
    // messageDiv.className = 'message';
    // messageDiv.textContent = `${data.username}: ${data.message}`;
    // messagesContainer.appendChild(messageDiv);

    // // Auto-scroll to bottom
    // messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const newNode = document.createElement("p");
    const textNode = document.createTextNode(`${data.username}: ${data.message}`);
    newNode.appendChild(textNode);
    messagesContainer.insertBefore(newNode, messagesContainer.children[-1]);

    // Auto-scroll to bottom
    chat.scrollTop = messagesContainer.scrollHeight;
    // Show toast notification
    showToast(`${data.username}: ${data.message}`);
});

// Handle user joined/left notifications
socket.on('user_joined', (data) => {
    // const messageDiv = document.createElement('div');
    // messageDiv.className = 'system-message';
    // messageDiv.textContent = `${data.username} joined the room`;
    // messagesContainer.appendChild(messageDiv);
    // messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const newNode = document.createElement("p");
    const textNode = document.createTextNode(`${data.username} joined the room`);
    newNode.appendChild(textNode);
    messagesContainer.insertBefore(newNode, messagesContainer.children[-1]);

    // Auto-scroll to bottom
    chat.scrollTop = messagesContainer.scrollHeight;
    updateUserList(data.users);
    // Show toast notification
    showToast(`${data.username} joined the room`);
});
socket.on('user_left', (data) => {
    // const messageDiv = document.createElement('div');
    // messageDiv.className = 'system-message';
    // messageDiv.textContent = `${data.username} left the room`;
    // chat.insertBefore(messageDiv, chatInput);

    const newNode = document.createElement("p");
    const textNode = document.createTextNode(`${data.username} left the room`);
    newNode.appendChild(textNode);
    messagesContainer.insertBefore(newNode, messagesContainer.children[-1]);

    // Auto-scroll to bottom
    chat.scrollTop = messagesContainer.scrollHeight;
    updateUserList(data.users);
    // Show toast notification
    showToast(`${data.username} left the room`);
});



// Counter goes here, currently offline only
// Menu toggle functionality
const setTotal = document.getElementById('set-totaltimer');
const setPhase = document.getElementById('set-phasetimer');
const setBreak = document.getElementById('set-breaktimer');
const totalContainer = document.getElementById('total-container');
const phaseContainer = document.getElementById('phase-container');
const breakContainer = document.getElementById('break-container');
const timerDisplay = document.getElementById('timer');
const breakDisplay = document.getElementById('break');
const startButton = document.getElementById('start');


// Keep existing menu toggle events
setTotal.addEventListener('click', (e) => {
    totalContainer.classList.toggle('set');
    phaseContainer.classList.remove('set');
    breakContainer.classList.remove('set');
});

setPhase.addEventListener('click', (e) => {
    phaseContainer.classList.toggle('set');
    totalContainer.classList.remove('set');
    breakContainer.classList.remove('set');
});

setBreak.addEventListener('click', (e) => {
    breakContainer.classList.toggle('set');
    totalContainer.classList.remove('set');
    phaseContainer.classList.remove('set');
});

// Timer state
let totalTime = 0; // 0h in seconds
let phaseTime = 0; // 0h in seconds
let breakTime = 0;  // 0m in seconds
let currentPhaseTime = phaseTime;
let currentBreakTime = breakTime;
let isRunning = false;
let isBreak = false;
let timerInterval;

// Socket event handlers
socket.on('timer_update', (data) => {
    totalTime = data.totalTime;
    currentPhaseTime = data.currentPhaseTime;
    currentBreakTime = data.currentBreakTime;
    isBreak = data.isBreak;
    isRunning = data.isRunning;

    updateDisplay();
    updateBreakDisplay();

    startButton.textContent = isRunning ? 'Stop' : 'Start';
});

socket.on('phase_chose', (data) => {
    Toastify({
        text: `Phase chose: ${data.phaseTime / 60} minutes`,
        duration: 3000,
        gravity: "top",
        position: 'right',
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(90deg, #359508 0%, #40ad0a 42%)",
        },
    }).showToast();
})

socket.on('break_chose', (data) => {
    Toastify({
        text: `Break chose: ${data.breakTime / 60} minutes`,
        duration: 3000,
        gravity: "top",
        position: 'right',
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(90deg, #359508 0%, #40ad0a 42%)",
        },
    }).showToast();
})

socket.on('error_message', (data) => {
    Toastify({
        text: data.message,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #d9534f, #c9302c)", // Red background for errors
        },
    }).showToast();
});

socket.on('timer_complete', () => {
    // alert('Timer complete!');
    Toastify({
        text: `Timer complete`,
        duration: 3000,
        gravity: "top",
        position: 'right',
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(90deg, #b8a60a 0%, #bda814 35%);",
        },
    }).showToast();

    isRunning = false;
    startButton.textContent = 'Start';
});

socket.on('break_complete', () => {
    // alert('Break time is over!');
    Toastify({
        text: `Break time is over`,
        duration: 3000,
        gravity: "top",
        position: 'right',
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(90deg, #b8a60a 0%, #bda814 35%)",
        },
    }).showToast();
    isBreak = false;
});

socket.on('phase_complete', () => {
    // alert('Phase complete!');
    Toastify({
        text: `Phase complete`,
        duration: 3000,
        gravity: "top",
        position: 'right',
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: "linear-gradient(90deg, #b8a60a 0%, #bda814 35%);",
        },
    }).showToast();
});


// Add click handlers for time buttons
document.querySelectorAll('#total-container button').forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.id.replace('total', ''));
        totalTime += minutes * 60;
        socket.emit('set_time', { totalTime, type: 'total' });
        updateDisplay();
    });
});

document.querySelectorAll('#phase-container button').forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.id.replace('phase', ''));
        phaseTime = minutes * 60;
        currentPhaseTime = phaseTime;
        // Toastify({
        //     text: `Phase chose: ${minutes} minutes`,
        //     duration: 3000,
        //     gravity: "top",
        //     position: 'right',
        //     stopOnFocus: true, // Prevents dismissing of toast on hover
        //     style: {
        //         background: "linear-gradient(to right, #00b09b, #96c93d)",
        //     },
        // }).showToast();
        socket.emit('set_time', { phaseTime, type: 'phase' });
        updateDisplay();
        phaseContainer.classList.remove('set');
    });
});

document.querySelectorAll('#break-container button').forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.id.replace('break', ''));
        breakTime = minutes * 60;
        currentBreakTime = breakTime;
        // Toastify({
        //     text: `Break chose: ${minutes} minutes`,
        //     duration: 3000,
        //     gravity: "top",
        //     position: 'right',
        //     stopOnFocus: true, // Prevents dismissing of toast on hover
        //     style: {
        //         background: "linear-gradient(to right, #00b09b, #96c93d)",
        //     },
        // }).showToast();

        socket.emit('set_time', { breakTime, type: 'break' });
        updateBreakDisplay();
        breakContainer.classList.remove('set');
    });
});

// Format time as HH:MM:SS or MM:SS
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(totalTime);
}

function updateBreakDisplay() {
    breakDisplay.textContent = formatTime(currentBreakTime);
}

// function handlePhaseComplete() {
//     // alert('Phase complete!');
//     if (breakTime > 0) {
//         isBreak = true;
//         currentBreakTime = breakTime;
//         socket.emit('phase_complete');
//         updateBreakDisplay();
//     }
// }


startButton.addEventListener('click', () => {
    if (!isRunning) {
        socket.emit('start_timer');
    } else {
        socket.emit('stop_timer');
    }
});

// Initial display update
updateDisplay();
updateBreakDisplay();