const setSound = document.getElementById('set-sound');
const soundControl = document.getElementById('sound-control')

setSound.addEventListener('click', (e) => {
    soundControl.classList.toggle('set');
})

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

let player;
let currentPlaylistID = 'RDQMoMVlAWrQvxU';
let volume = 50;
function onPlayerReady(event) {
    // Set initial volume
    player.setVolume(volume);

    // Add volume control after player is ready
    setupVolumeControl();
}
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: {
            'listType': 'playlist',
            'list': currentPlaylistID, // The playlist ID from URL
            'autoplay': 0,  // Not play automatically
            'controls': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
};

let isLooping = false;

document.getElementById('playPause').onclick = () => {
    let state = player.getPlayerState();
    if (state === 1) {
        player.pauseVideo();
        document.getElementById('playPause').innerHTML = 'Play';
    } else {
        player.playVideo();
        document.getElementById('playPause').innerHTML = 'Pause'
    }
};

document.getElementById('next').onclick = () => {
    player.nextVideo();
};

document.getElementById('prev').onclick = () => {
    player.previousVideo();
};

document.getElementById('loop').onclick = () => {
    isLooping = !isLooping;
    player.setLoop(isLooping);
};

// Volume control
const volumeControl = document.getElementById('volume')

function setupVolumeControl() {
    volumeControl.addEventListener('input', (e) => {
        volume = parseInt(e.target.value)
        if (player && player.setVolume) {
            player.setVolume(volume);
        }
    })
}

// Play list upload
const playlistInput = document.getElementById('playlistacpt');
const submit = document.getElementById('submit')
function extractID(url) {
    const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
    const match = url.match(regex);
    if (match) {
        return match[1]; // Return the playlist ID
    } else {
        return null; // Return null if no match is found
    }
}

submit.addEventListener('click', () => {
    const id = extractID(playlistInput.value);

    if (!id) {
        Toastify({
            text: "Invalid playlist URL. Please provide a valid YouTube playlist link.",
            duration: 3000,
            gravity: "top",
            position: 'center',
            style: {
                background: "linear-gradient(90deg, #950808 0%, #ad0a0a 42%)",
            },
        }).showToast();
        return;
    }

    // Update current playlist ID
    currentPlaylistID = id;

    // Load the new playlist
    if (player) {
        // Stop current playback
        player.stopVideo();

        // Load the new playlist
        player.loadPlaylist({
            list: currentPlaylistID,
            listType: 'playlist',
            index: 0,
            startSeconds: 0
        });

        // Optionally start playing automatically
        // player.playVideo();

        Toastify({
            text: `Success! New playlist loaded.`,
            duration: 3000,
            gravity: "top",
            position: 'center',
            stopOnFocus: true,
            style: {
                background: "linear-gradient(90deg, #359508 0%, #40ad0a 42%)",
            },
        }).showToast();
        document.getElementById('playPause').innerHTML = 'Pause';
        playlistInput.value = ''

    } else {
        Toastify({
            text: "Player not ready yet. Please try again in a moment.",
            duration: 3000,
            gravity: "top",
            position: 'center',
            style: {
                background: "linear-gradient(90deg, #957c08 0%, #ad9d0a 42%)",
            },
        }).showToast();
    }
});


// https://www.youtube.com/playlist?list=PLf9WdYobXNxA3x7Tyz70zvAo0J48E8y6T

// player.addEventListener('onStateChange', (event) => {
//     if (event.data === YT.PlayerState.ENDED && isLooping) {
//         player.playVideo();
//     }
// });

