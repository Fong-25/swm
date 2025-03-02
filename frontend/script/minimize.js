const draggable = document.getElementById("container");
const centerBtn = document.getElementById("center");
// Add PiP button
// const pipBtn = document.createElement("button");
// pipBtn.id = "pip-mode";
// pipBtn.textContent = "PiP";
// pipBtn.style.marginLeft = "10px";
// draggable.appendChild(pipBtn);
const pipBtn = document.getElementById('pip-mode')

let isDragging = false;
let offsetX, offsetY;
let isPipActive = false;

// Create a PiP window with a canvas that mirrors the container
let pipWindow = null;
let pipCanvas = document.createElement("canvas");
let pipVideo = document.createElement("video");

// Set up video stream from container for PiP
pipVideo.srcObject = null;
pipVideo.autoplay = true;
pipVideo.muted = true;

draggable.addEventListener("mousedown", (e) => {
    if (isPipActive) return; // Don't allow dragging when in PiP mode

    isDragging = true;
    draggable.style.transition = 'none';
    offsetX = e.clientX - draggable.getBoundingClientRect().left;
    offsetY = e.clientY - draggable.getBoundingClientRect().top;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
        draggable.style.transition = 'none'
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Get the dimensions of the draggable div
        const divWidth = draggable.offsetWidth;
        const divHeight = draggable.offsetHeight;

        // Boundary checks
        newX = Math.max(0, Math.min(newX, windowWidth - divWidth));
        newY = Math.max(0, Math.min(newY, windowHeight - divHeight));

        draggable.style.left = `${newX}px`;
        draggable.style.top = `${newY}px`;
    }
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    document.body.style.userSelect = ""; // Restore text selection
    draggable.style.transition = '0.6s ease'
});

// Center button functionality
centerBtn.addEventListener("click", () => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const divWidth = draggable.offsetWidth;
    const divHeight = draggable.offsetHeight;

    const centerX = (windowWidth - divWidth) / 2;
    const centerY = (windowHeight - divHeight) / 2;

    draggable.style.left = `${centerX}px`;
    draggable.style.top = `${centerY}px`;
});

// PiP button functionality
// PiP button functionality
pipBtn.addEventListener("click", async () => {
    try {
        if (!isPipActive) {
            // Set up the canvas to capture the container
            pipCanvas.width = draggable.offsetWidth;
            pipCanvas.height = draggable.offsetHeight;

            // Set up the video track from the canvas
            const canvasStream = pipCanvas.captureStream();
            pipVideo.srcObject = canvasStream;

            // Start rendering the container to the canvas
            startContainerCapture();

            // Make sure video metadata is loaded before requesting PiP
            if (pipVideo.readyState === 0) {
                // Wait for metadata to load
                await new Promise((resolve, reject) => {
                    pipVideo.onloadedmetadata = resolve;
                    pipVideo.onerror = reject;

                    // Set a timeout in case metadata loading takes too long
                    const timeout = setTimeout(() => {
                        reject(new Error("Timeout waiting for video metadata"));
                    }, 3000);

                    // Clear timeout if metadata loads successfully
                    pipVideo.onloadedmetadata = () => {
                        clearTimeout(timeout);
                        resolve();
                    };
                });
            }

            // Play the video (required in some browsers before PiP)
            await pipVideo.play();

            // Request Picture-in-Picture
            await pipVideo.requestPictureInPicture();
            pipWindow = pipVideo.pictureInPictureElement;

            isPipActive = true;
            // pipBtn.textContent = "Exit PiP";

            // Hide the container while in PiP mode
            draggable.style.visibility = "hidden";

            // Listen for PiP window close
            pipVideo.addEventListener('leavepictureinpicture', onLeavePiP);
        } else {
            // Exit PiP mode
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            }
            onLeavePiP();
        }
    } catch (error) {
        console.error("PiP failed:", error);
        // Show a toast notification if available
        if (typeof Toastify === 'function') {
            Toastify({
                text: "Picture-in-Picture failed: " + error.message,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "center",
                backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
            }).showToast();
        } else {
            alert("Picture-in-Picture failed: " + error.message);
        }
    }
});
function onLeavePiP() {
    isPipActive = false;
    // pipBtn.textContent = "PiP";
    draggable.style.visibility = "visible";
    stopContainerCapture();
}

// Animation frame to capture container content
let captureRAF = null;

function startContainerCapture() {
    // Function to capture the container and draw it on canvas
    const capture = () => {
        const ctx = pipCanvas.getContext('2d', { alpha: true });  // Explicitly request alpha channel

        // Clear the canvas with transparent background
        ctx.clearRect(0, 0, pipCanvas.width, pipCanvas.height);

        // Get the computed styles from the container
        const containerStyle = window.getComputedStyle(draggable);
        const timerEl = document.getElementById('timer');
        const breakEl = document.getElementById('break');

        // Use a transparent background color
        const backgroundColor = 'rgb(15, 153, 5)'; // Adjust alpha as needed

        // Draw a background with rounded corners
        ctx.fillStyle = backgroundColor;
        const cornerRadius = 8; // Adjust for more or less rounded corners

        // Draw rounded rectangle for background
        ctx.beginPath();
        ctx.moveTo(cornerRadius, 0);
        ctx.lineTo(pipCanvas.width - cornerRadius, 0);
        ctx.quadraticCurveTo(pipCanvas.width, 0, pipCanvas.width, cornerRadius);
        ctx.lineTo(pipCanvas.width, pipCanvas.height - cornerRadius);
        ctx.quadraticCurveTo(pipCanvas.width, pipCanvas.height, pipCanvas.width - cornerRadius, pipCanvas.height);
        ctx.lineTo(cornerRadius, pipCanvas.height);
        ctx.quadraticCurveTo(0, pipCanvas.height, 0, pipCanvas.height - cornerRadius);
        ctx.lineTo(0, cornerRadius);
        ctx.quadraticCurveTo(0, 0, cornerRadius, 0);
        ctx.closePath();
        ctx.fill();

        // Add a subtle border/glow effect (optional)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (timerEl) {
            // Get the timer's font style or use a nice default
            const timerFont = window.getComputedStyle(timerEl).font;
            const timerColor = '#ffffff';

            ctx.font = timerFont;

            // Add text shadow for better readability
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 1;

            ctx.fillStyle = timerColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(timerEl.textContent, pipCanvas.width / 2, pipCanvas.height / 2);

            // Reset shadow for other elements
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
        }

        // Draw the break timer if visible
        if (breakEl && breakEl.textContent !== "0:00") {
            const breakFont = window.getComputedStyle(breakEl).font;
            const breakColor = 'rgb(255, 255, 204)';

            ctx.font = breakFont;
            ctx.fillStyle = breakColor;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(breakEl.textContent, pipCanvas.width / 2, 15);
        }

        captureRAF = requestAnimationFrame(capture);
    };

    // Start the capture loop
    captureRAF = requestAnimationFrame(capture);
}

function stopContainerCapture() {
    if (captureRAF) {
        cancelAnimationFrame(captureRAF);
        captureRAF = null;
    }

    if (pipVideo.srcObject) {
        const tracks = pipVideo.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        pipVideo.srcObject = null;
    }
}

// Feature detection for PiP
if (!document.pictureInPictureEnabled) {
    pipBtn.disabled = true;
    pipBtn.title = "Picture-in-Picture not supported in your browser";

    // Show a toast notification if available
    if (typeof Toastify === 'function') {
        Toastify({
            text: "Picture-in-Picture is not supported in your browser",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "linear-gradient(to right, #ff5f6d, #ffc371)",
        }).showToast();
    }
}

// origin