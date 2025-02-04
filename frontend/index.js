const setTimer = document.getElementById('set-timer');
const setBackground = document.getElementById('set-background');
const setColor = document.getElementById('set-color');
const setSound = document.getElementById('set-sound');
const setNote = document.getElementById('set-note');
const setText = document.getElementById('set-text');

const container = document.getElementById('container');

function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.25)';
    }
    throw new Error('Bad Hex');
}

setColor.addEventListener('change', (e) => {
    const selectedColor = e.target.value; //Returns hex color value
    container.style.backgroundColor = hexToRgbA(selectedColor);
    // Use the color value here
});

setText.addEventListener('change', (e) => {
    const selectedText = e.target.value;
    container.style.color = selectedText;
    // Use the text value here
});