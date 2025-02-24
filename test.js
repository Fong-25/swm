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

console.log(player.playerVars[1])