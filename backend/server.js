// backend/server.js
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const path = require('path');
require('dotenv').config();

// Configure Socket.IO with optimized settings
const io = require('socket.io')(http, {
    cors: {
        origin: 'https://studytogertherat.onrender.com',
        // origin: 'http://localhost:3000/',
        methods: ["GET", "POST"]
    },
    // Add Socket.IO specific settings
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
    // Optimize for multiple connections
    connectTimeout: 45000
});

// Configure rate limit with more lenient settings for Render.com
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // increased from 100
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for static files and Socket.IO connections
    skip: (req) => {
        return req.headers.upgrade === 'websocket' ||
            req.url.startsWith('/resources/') ||
            req.url.endsWith('.html') ||
            req.url.endsWith('.css') ||
            req.url.endsWith('.js');
    }
});

// Apply rate limiting only to non-static routes
app.use('/api/', limiter);

// Configure Helmet with less restrictive settings
const helmet = require('helmet');
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://www.youtube.com', 'https://cdn.jsdelivr.net', 'https://cdn.socket.io'],
            connectSrc: ["'self'", 'wss:', 'ws:', 'https://studytogertherat.onrender.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
            fontSrc: ["'self'", 'https:', 'data:'],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'self'", 'https://www.youtube.com']
        }
    }
}));
// let server;
// if (process.env.NODE_ENV === 'production') {
//     const https = require('https');
//     const fs = require('fs');
//     server = https.createServer({
//         key: fs.readFileSync('/path/to/your/ssl/key.pem'),
//         cert: fs.readFileSync('/path/to/your/ssl/cert.pem')
//     }, app);
// } else {
//     server = require('http').createServer(app);
// }

// Move `timerState` to the top so all socket events can access it
const roomTimers = {}; // Store timers for each room
let timerIntervals = {}; // Store interval references per room

// app.use((req, res, next) => {
//     res.setHeader("Content-Security-Policy", "script-src 'self' https://cdn.socket.io");
//     next();
// });

app.use((req, res, next) => {
    res.setHeader(
        "Content-Security-Policy",
        "script-src 'self' https://www.youtube.com https://cdn.jsdelivr.net https://cdn.socket.io;"
    );
    next();
});

// Serve frontend, making it act as the root
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve resources like images and videos
app.use("/resources", express.static(path.join(__dirname, "../resources")));

// Ensure index.html is served on the root
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Store active rooms and their members
const rooms = new Map();

io.on('connection', (socket) => {
    // Room and chatting
    let currentRoom = null;
    let username = null;

    // Handle username registration
    socket.on('register_username', (name, callback) => {
        if (!name || name.trim() === '') {
            callback({ success: false, message: 'Username is required' });
            return;
        }
        username = name.trim();
        callback({ success: true });
    });

    // Handle room creation
    socket.on('create_room', (roomId, callback) => {
        if (!username) {
            callback({ success: false, message: 'Please set username first' });
            return;
        }

        if (rooms.has(roomId)) {
            callback({ success: false, message: 'Room already exists' });
            return;
        }

        rooms.set(roomId, new Set([username]));
        currentRoom = roomId;
        socket.join(roomId);
        callback({ success: true });

        // Broadcast to all users in room
        io.to(roomId).emit('user_joined', { username, users: Array.from(rooms.get(roomId)) });

        // Debug
        roomTimers[currentRoom] = {
            totalTime: 0,
            phaseTime: 0,
            breakTime: 0,
            currentPhaseTime: 0,
            currentBreakTime: 0,
            isRunning: false,
            isBreak: false
        };
    });

    // Handle room joining
    socket.on('join_room', (roomId, callback) => {
        if (!username) {
            callback({ success: false, message: 'Please set username first' });
            return;
        }

        if (!rooms.has(roomId)) {
            callback({ success: false, message: 'Room does not exist' });
            return;
        }

        const room = rooms.get(roomId);
        room.add(username);
        currentRoom = roomId;
        socket.join(roomId);
        callback({ success: true });

        // Broadcast to all users in room
        // io.to(roomId).emit('user_joined', { username, users: Array.from(room) });
        io.to(roomId).emit('user_joined', { username, users: Array.from(rooms.get(roomId)) });
    });

    // Handle chat messages
    socket.on('chat_message', (message) => {
        if (currentRoom && username) {
            io.to(currentRoom).emit('chat_message', {
                username,
                message,
                timestamp: new Date().toISOString()
            });
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        if (currentRoom && username) {
            const room = rooms.get(currentRoom);
            if (room) {
                room.delete(username);
                if (room.size === 0) {
                    roomTimers[currentRoom] = {
                        totalTime: 0,
                        phaseTime: 0,
                        breakTime: 0,
                        currentPhaseTime: 0,
                        currentBreakTime: 0,
                        isRunning: false,
                        isBreak: false
                    };
                    rooms.delete(currentRoom);

                } else {
                    // io.to(currentRoom).emit('user_left', {
                    //     username,
                    //     users: Array.from(room)
                    // });
                    io.to(currentRoom).emit('user_left', { username, users: Array.from(room) });
                }
            }
        }
    });

    // Timer
    socket.on('set_time', (data) => {
        if (!currentRoom) return; // Ensure the user is in a room

        if (!roomTimers[currentRoom]) {
            roomTimers[currentRoom] = {
                totalTime: 0,
                phaseTime: 0,
                breakTime: 0,
                currentPhaseTime: 0,
                currentBreakTime: 0,
                isRunning: false,
                isBreak: false
            };
        }

        switch (data.type) {
            case 'total':
                roomTimers[currentRoom].totalTime = data.totalTime;
                break;
            case 'phase':
                roomTimers[currentRoom].phaseTime = data.phaseTime;
                roomTimers[currentRoom].currentPhaseTime = data.phaseTime;
                io.to(currentRoom).emit('phase_chose', roomTimers[currentRoom]); // Toast
                break;
            case 'break':
                roomTimers[currentRoom].breakTime = data.breakTime;
                roomTimers[currentRoom].currentBreakTime = data.breakTime;
                io.to(currentRoom).emit('break_chose', roomTimers[currentRoom]); // Toast
                break;
        }

        io.to(currentRoom).emit('timer_update', roomTimers[currentRoom]); // Only emit to the room
    });

    socket.on('start_timer', () => {
        if (!currentRoom) return; // Ensure the user is in a room

        if (!roomTimers[currentRoom]) return; // No timer set for this room

        if (!roomTimers[currentRoom]) return; // No timer initialized for this room

        if (roomTimers[currentRoom].phaseTime === 0) { //  Prevent starting if phase time is not set
            socket.emit('error_message', { message: 'Please select a phase time before starting the timer.' });
            return;
        }

        roomTimers[currentRoom].isRunning = true;
        io.to(currentRoom).emit('timer_update', roomTimers[currentRoom]);

        clearInterval(timerIntervals[currentRoom]); // Stop any existing timer
        timerIntervals[currentRoom] = setInterval(() => {
            let timer = roomTimers[currentRoom];

            if (timer.isBreak) {
                timer.currentBreakTime--;

                if (timer.currentBreakTime <= 0) {
                    timer.isBreak = false;
                    timer.currentPhaseTime = timer.phaseTime;
                    io.to(currentRoom).emit('break_complete');
                    timer.currentBreakTime = timer.breakTime; // Reset break time for the next cycle
                }
            } else {
                timer.totalTime--;
                timer.currentPhaseTime--;

                if (timer.currentPhaseTime <= 0) {
                    if (timer.breakTime > 0) {
                        timer.isBreak = true;
                        timer.currentBreakTime = timer.breakTime;
                        io.to(currentRoom).emit('phase_complete');
                    }
                }

                if (timer.totalTime <= 0) {
                    clearInterval(timerIntervals[currentRoom]);
                    timer.isRunning = false;
                    io.to(currentRoom).emit('timer_complete');
                }
            }

            io.to(currentRoom).emit('timer_update', timer);
        }, 1000);
    });

    socket.on('stop_timer', () => {
        if (!currentRoom) return;

        clearInterval(timerIntervals[currentRoom]);
        roomTimers[currentRoom].isRunning = false;
        io.to(currentRoom).emit('timer_update', roomTimers[currentRoom]);
    });

    socket.on('phase_complete', () => {
        io.to(currentRoom).emit('phase_complete');
    });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


