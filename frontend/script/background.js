const setBackground = document.getElementById('set-background');

const video = document.getElementById('background-video');

// Array of video sources
const videos = [
    "../resources/videos/back1.mp4",
    "../resources/videos/back2.mp4",
    "../resources/videos/back3.mp4"
];

let currentVideoIndex = 0;

setBackground.addEventListener('click', () => {
    // Increment the index and check if it exceeds the video array length
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    // Update the video source
    video.src = videos[currentVideoIndex];
    // // Load and play the new video
    video.load();
    video.play();
});