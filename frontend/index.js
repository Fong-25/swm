const setTotal = document.getElementById('set-totaltimer');
const setPhase = document.getElementById('set-phasetimer');
const setBreak = document.getElementById('set-breaktimer');
const setBackground = document.getElementById('set-background');
const setColor = document.getElementById('set-color');
const setSound = document.getElementById('set-sound');
const setNote = document.getElementById('set-note');
const setText = document.getElementById('set-text');
const control = document.querySelector('.control');
const openMenu = document.getElementById('open-menu');
const setFull = document.getElementById('full');

const container = document.getElementById('container');

// Convert hex to rgba for glass effect
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c = hex.substring(1).split('');
        if(c.length== 3){
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
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
    const selectedTextColor = e.target.value;
    const text = document.getElementById('timer')
    text.style.color = selectedTextColor
    // Use the text value here
});

openMenu.addEventListener('change', (e) => {
    if (e.target.checked) {
        // Menu is open
        control.style.left = '0px'
    } else {
        // Menu is closed 
        control.style.left = '-50px'
    }
});

// test
// setBreak.addEventListener('click', (e) => {
//     alert('Phase Timer Set');
//     // Use the phase value here
// });

setFull.addEventListener('click', (e) => {
    e.preventDefault();
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen()
        .catch(err => console.log(`Error attempting to enable fullscreen: ${err.message}`));
    } else {
        // Exit fullscreen
        document.exitFullscreen();
    }
});

