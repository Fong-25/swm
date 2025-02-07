const draggable = document.getElementById('container');
const resetButton = document.getElementById('center');
let originalX = draggable.offsetLeft;
let originalY = draggable.offsetTop;
let offsetX, offsetY;

draggable.addEventListener('mousedown', function (e) {
    offsetX = e.clientX - draggable.getBoundingClientRect().left;
    offsetY = e.clientY - draggable.getBoundingClientRect().top;

    function onMouseMove(e) {
        let newX = e.clientX - offsetX;
        let newY = e.clientY - offsetY;

        // Constrain the movement within the window's bounds
        const maxX = window.innerWidth - draggable.offsetWidth;
        const maxY = window.innerHeight - draggable.offsetHeight;

        // Prevent dragging out of bounds
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));

        draggable.style.left = newX + 'px';
        draggable.style.top = newY + 'px';
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

// Reset the draggable element's position to its original position
resetButton.addEventListener('click', function() {
    draggable.style.left = originalX + 'px';
    draggable.style.top = originalY + 'px';
});