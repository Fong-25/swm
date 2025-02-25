
const controllers = document.querySelectorAll('.controller');

const setColor = document.getElementById('set-color');
const setText = document.getElementById('set-text');
const setIcon = document.getElementById('set-icon')
const control = document.querySelector('.control');
const openMenu = document.getElementById('open-menu');
const setFull = document.getElementById('full');
const setBar = document.getElementById('set-bar');

const container = document.getElementById('container');
const images = document.querySelectorAll('.control button img');
const labels = document.querySelectorAll('.control label');
const fullColor = document.querySelectorAll('.full img');
const fullFile = document.querySelectorAll('.file label img');
const quoteFile = document.querySelectorAll('.quote img')


// Convert hex to rgba for glass effect
function hexToRgbA025(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.25)';
    }
    throw new Error('Bad Hex');
}

function hexToRgbA08(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.8)';
    }
    throw new Error('Bad Hex');
}

setColor.addEventListener('change', (e) => {
    const selectedColor = e.target.value; //Returns hex color value
    container.style.backgroundColor = hexToRgbA025(selectedColor);
    // Use the color value here
});

setText.addEventListener('change', (e) => {
    const selectedTextColor = e.target.value;
    const text = document.getElementById('timer');
    const breaktimer = document.getElementById('break');
    text.style.color = selectedTextColor;
    breaktimer.style.color = selectedTextColor
    // Use the text value here
});

openMenu.addEventListener('change', (e) => {
    if (e.target.checked) {
        // Menu is open
        control.style.left = '0px';
    } else {
        // Menu is closed 
        control.style.left = '-50px';
        const total = document.getElementById('total-container');
        const phase = document.getElementById('phase-container');
        const breakk = document.getElementById('break-container');
        const sound = document.getElementById('sound-control');
        const background = document.getElementById('background-container');
        const backgroundContainer = document.getElementById('background-container')

        total.classList.remove('set');
        phase.classList.remove('set');
        breakk.classList.remove('set');
        sound.classList.remove('set');
        background.classList.remove('set');
        backgroundContainer.classList.remove('set')
    }
});

// Close the menu and uncheck the checkbox when clicking outside the menu, commented because dont like it
// document.addEventListener('click', (e) => {
//     if (openMenu.checked && !e.target.closest('.control') && !e.target.closest('.index')) {
//         // Clicked outside the menu or the toggle, so uncheck the checkbox and close the menu
//         openMenu.checked = false;
//         control.style.left = '-50px';
//     }
// });

// test
// setBreak.addEventListener('click', (e) => {
//     alert('Phase Timer Set');
//     // Use the phase value here
// });

setIcon.addEventListener('change', (e) => {
    images.forEach(img => {
        img.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${e.target.value})`;
    });

    labels.forEach(label => {
        label.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${e.target.value})`;
    });
    fullColor.forEach(img => {
        img.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${e.target.value})`;
    });
    fullFile.forEach(img => {
        img.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${e.target.value})`;
    });
    quoteFile.forEach(img => {
        img.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${e.target.value})`;
    });

    const about = document.querySelectorAll('.about img')
    about.forEach(img => {
        img.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${e.target.value})`;
    })
    const rooms = document.querySelectorAll('.room img');
    rooms.forEach(img => {
        img.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${e.target.value})`;
    })

    const pip = document.querySelectorAll('.pip img');
    pip.forEach(img => {
        img.style.filter = `opacity(0.5) drop-shadow(0 0 0 ${e.target.value})`
    })
});

setFull.addEventListener('click', (e) => {
    e.preventDefault();
    const fullIMG = document.querySelector('.full img')
    if (!document.fullscreenElement) {
        // Enter fullscreen
        document.documentElement.requestFullscreen()
            .catch(err => console.log(`Error attempting to enable fullscreen: ${err.message}`));
        fullIMG.src = '../resources/icons/fullexit.png';
    } else {
        // Exit fullscreen
        document.exitFullscreen();
        fullIMG.src = '../resources/icons/full.png';
    }
});

setBar.addEventListener('change', (e) => {
    const selectedColor = e.target.value; //Returns hex color value
    control.style.backgroundColor = hexToRgbA08(selectedColor);
    const about = document.getElementById('about');
    about.style.backgroundColor = hexToRgbA08(selectedColor);
    const full = document.getElementById('full');
    full.style.backgroundColor = hexToRgbA08(selectedColor);
    const file = document.getElementById('file');
    file.style.backgroundColor = hexToRgbA08(selectedColor);
    const quote = document.getElementById('quote');
    quote.style.backgroundColor = hexToRgbA08(selectedColor);
    const index = document.getElementById('index');
    index.style.backgroundColor = hexToRgbA08(selectedColor);
    const create = document.getElementById('createRoom');
    create.style.backgroundColor = hexToRgbA08(selectedColor);
    const join = document.getElementById('joinRoom');
    join.style.backgroundColor = hexToRgbA08(selectedColor);
    const pip = document.getElementById('pip-mode');
    pip.style.backgroundColor = hexToRgbA08(selectedColor)
});




// Active this later if local-saving didnt work
// window.addEventListener('beforeunload', function (e) {
//     // Custom message for user
//     const message = "Are you sure you want to leave? Your changes may not be saved.";

//     // Standard method for showing a confirmation dialog on some browsers
//     e.returnValue = message;

//     // For some other browsers, you might need to return the message explicitly
//     return message;
// });
