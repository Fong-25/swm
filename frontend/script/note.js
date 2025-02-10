const setNote = document.getElementById('set-note');
const noteContainer = document.querySelector('.note-container');
const reset = document.getElementById('c');


let drag = false;
let Xoffset, Yoffset;
let isDragged = false;

setNote.addEventListener('click', () => {
    // noteContainer.classList.toggle('set');
    if (!isDragged) {
        noteContainer.classList.toggle('set');
        console.log(isDragged)
    } else {
        console.log(isDragged)
        if (noteContainer.classList.contains('set')) {
            noteContainer.style.left = '-230px';
            noteContainer.classList.remove('set')
            return
        } else {
            noteContainer.style.left = '70px'
            noteContainer.classList.add('set');
            return
        }
    }
})

reset.addEventListener('click', () => {
    document.getElementById('notes').value = '';
});


noteContainer.addEventListener("mousedown", (e) => {
    drag = true;
    isDragged = true;
    noteContainer.style.transition = 'none';
    Xoffset = e.clientX - noteContainer.getBoundingClientRect().left;
    Yoffset = e.clientY - noteContainer.getBoundingClientRect().top;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging;

});

document.addEventListener("mousemove", (e) => {
    if (drag) {
        noteContainer.style.transition = 'none'
        let newX = e.clientX - Xoffset;
        let newY = e.clientY - Yoffset;

        // Get window dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Get the dimensions of the noteContainer div
        const divWidth = noteContainer.offsetWidth;
        const divHeight = noteContainer.offsetHeight;

        // Boundary checks
        newX = Math.max(0, Math.min(newX, windowWidth - divWidth));
        newY = Math.max(0, Math.min(newY, windowHeight - divHeight));

        noteContainer.style.left = `${newX}px`;
        noteContainer.style.top = `${newY}px`;

    }
});

document.addEventListener("mouseup", () => {
    drag = false;
    document.body.style.userSelect = ""; // Restore text selection
    noteContainer.style.transition = '0.4s cubic-bezier(0.42, 0, 0.44, 1.68)';
});
