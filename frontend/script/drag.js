const draggable = document.getElementById("container");
const centerBtn = document.getElementById("center");

let isDragging = false;
let offsetX, offsetY;

draggable.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - draggable.getBoundingClientRect().left;
    offsetY = e.clientY - draggable.getBoundingClientRect().top;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
});

document.addEventListener("mousemove", (e) => {
    if (isDragging) {
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
