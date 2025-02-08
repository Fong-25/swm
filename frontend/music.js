const setSound = document.getElementById('set-sound');
const soundControl = document.getElementById('sound-control')

setSound.addEventListener('click', (e) => {
    soundControl.classList.toggle('set');
})

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

let player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '0',
        width: '0',
        playerVars: {
            'listType': 'playlist',
            'list': 'RDQMoMVlAWrQvxU', // The playlist ID from URL
            'autoplay': 0,  // Not play automatically
            'controls': 0
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

// player.addEventListener('onStateChange', (event) => {
//     if (event.data === YT.PlayerState.ENDED && isLooping) {
//         player.playVideo();
//     }
// });