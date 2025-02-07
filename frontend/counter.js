// separate JS for counter

const setTotal = document.getElementById('set-totaltimer');
const setPhase = document.getElementById('set-phasetimer');
const setBreak = document.getElementById('set-breaktimer');
const totalContainer = document.getElementById('total-container');
const phaseContainer = document.getElementById('phase-container');
const breakContainer = document.getElementById('break-container');
const timerDisplay = document.getElementById('timer');
const breakDisplay = document.getElementById('break');
const startButton = document.getElementById('start');


setTotal.addEventListener('click', (e) => {
    totalContainer.classList.toggle('set')
});

setPhase.addEventListener('click', (e) => {
    phaseContainer.classList.toggle('set')
});
setBreak.addEventListener('click', (e) => {
    breakContainer.classList.toggle('set')
});

let totalTime = 0; // Total timer in seconds
let phaseTime = 0; // Phase timer in seconds
let breakTime = 0; // Break timer in seconds
let timerInterval;

// Convert minutes to seconds
const getSeconds = (minutes) => minutes * 60;

// Format time as HH:MM:SS
const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

// Update total time
const updateTotalTime = (seconds) => {
    totalTime += seconds;
    timerDisplay.textContent = formatTime(totalTime);
};

// Set phase time (not cumulative)
const setPhaseTime = (seconds) => {
    phaseTime = seconds;
    alert(`Phase time set to ${formatTime(phaseTime)}`);
};

// Set break time (not cumulative)
const setBreakTime = (seconds) => {
    breakTime = seconds;
    breakDisplay.textContent = formatTime(breakTime);
};

// Event listeners for total timer
totalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.textContent);
        updateTotalTime(getSeconds(minutes));
    });
});

// Event listeners for phase timer
phaseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.textContent);
        setPhaseTime(getSeconds(minutes));
    });
});

// Event listeners for break timer
breakButtons.forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.textContent);
        setBreakTime(getSeconds(minutes));
    });
});

// Start timer function
const startTimer = () => {
    if (totalTime === 0) return;
    let timeLeft = totalTime;
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);
        } else {
            clearInterval(timerInterval);
            if (phaseTime > 0) {
                alert('Phase time ended! Starting break.');
                startBreak();
            }
        }
    }, 1000);
};

// Start break function
const startBreak = () => {
    if (breakTime === 0) return;
    let breakLeft = breakTime;
    const breakInterval = setInterval(() => {
        if (breakLeft > 0) {
            breakLeft--;
            breakDisplay.textContent = formatTime(breakLeft);
        } else {
            clearInterval(breakInterval);
            breakDisplay.textContent = '00:00';
        }
    }, 1000);
};

// Start button event listener
startButton.addEventListener('click', startTimer);
