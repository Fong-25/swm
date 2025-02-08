const setNote = document.getElementById('set-note');
const noteContainer = document.querySelector('.note-container');
const reset = document.getElementById('c');


setNote.addEventListener('click', (e) => {
    noteContainer.classList.toggle('set')
})

reset.addEventListener('click', (e) => {
    document.getElementById('notes').value = '';
})