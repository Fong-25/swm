const setBackground = document.getElementById('set-background');
const backgroundContainer = document.querySelector('.background-container')

const video = document.getElementById('background-video');

// Array of video sources
// const videos = [
//     "../resources/videos/back1.mp4",
//     "../resources/videos/back2.mp4",
//     "../resources/videos/back3.mp4"
// ];

let currentVideoIndex = 0;

// setBackground.addEventListener('click', () => {
//     // Increment the index and check if it exceeds the video array length
//     currentVideoIndex = (currentVideoIndex + 1) % videos.length;
//     // Update the video source
//     video.src = videos[currentVideoIndex];
//     // // Load and play the new video
//     video.load();
//     video.play();
// });

setBackground.addEventListener('click', () => {
    backgroundContainer.classList.toggle('set')
})

document.querySelectorAll('.background-chooser').forEach(button => {
    button.addEventListener('click', () => {
        const id = parseInt(button.id.replace('b', ''));
        video.src = `/resources/videos/back${id}.mp4`;
    })

});

const videoInput = document.getElementById('video');
videoInput.addEventListener('change', function (e) {
    const file = e.target.files[0];

    if (file) {
        // Revoke the previous object URL to avoid memory leaks
        if (video.src.startsWith('blob:')) {
            URL.revokeObjectURL(video.src);
        }

        // Create a new blob URL for the selected file
        const videoUrl = URL.createObjectURL(file);

        // Update video source and load the new video
        video.src = videoUrl;
        video.load();

        // Optional: Start playing automatically
        video.play();
    }
});

// Clean up blob URL when the page is unloaded
window.addEventListener('unload', function () {
    if (video.src.startsWith('blob:')) {
        URL.revokeObjectURL(videoPlayer.src);
    }
});