// Menu toggle functionality
const setTotal = document.getElementById('set-totaltimer');
const setPhase = document.getElementById('set-phasetimer');
const setBreak = document.getElementById('set-breaktimer');
const totalContainer = document.getElementById('total-container');
const phaseContainer = document.getElementById('phase-container');
const breakContainer = document.getElementById('break-container');
const timerDisplay = document.getElementById('timer');
const breakDisplay = document.getElementById('break');
const startButton = document.getElementById('start');

// Keep existing menu toggle events
setTotal.addEventListener('click', (e) => {
    totalContainer.classList.toggle('set')
});

setPhase.addEventListener('click', (e) => {
    phaseContainer.classList.toggle('set')
});

setBreak.addEventListener('click', (e) => {
    breakContainer.classList.toggle('set')
});

// Timer state
let totalTime = 0; // 0h in seconds
let phaseTime = 0; // 0h in seconds
let breakTime = 0;  // 0m in seconds
let currentPhaseTime = phaseTime;
let currentBreakTime = breakTime;
let isRunning = false;
let isBreak = false;
let timerInterval;

// Add click handlers for time buttons
document.querySelectorAll('#total-container button').forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.id.replace('total', ''));
        totalTime += minutes * 60;
        updateDisplay();
    });
});

document.querySelectorAll('#phase-container button').forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.id.replace('phase', ''));
        phaseTime = minutes * 60;
        currentPhaseTime = phaseTime;
        updateDisplay();
    });
});

document.querySelectorAll('#break-container button').forEach(button => {
    button.addEventListener('click', () => {
        const minutes = parseInt(button.id.replace('break', ''));
        breakTime = minutes * 60;
        currentBreakTime = breakTime;
        updateBreakDisplay();
    });
});

// Format time as HH:MM:SS or MM:SS
function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    timerDisplay.textContent = formatTime(totalTime);
}

function updateBreakDisplay() {
    breakDisplay.textContent = formatTime(currentBreakTime);
}

function handlePhaseComplete() {
    alert('Phase complete!');
    if (breakTime > 0) {
        isBreak = true;
        currentBreakTime = breakTime;
        updateBreakDisplay();
    }
}

startButton.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        startButton.textContent = 'Stop';

        timerInterval = setInterval(() => {
            if (isBreak) {
                currentBreakTime--;
                updateBreakDisplay();

                if (currentBreakTime <= 0) {
                    isBreak = false;
                    currentPhaseTime = phaseTime;
                    alert('Break time is over!');
                }
            } else {
                totalTime--;
                currentPhaseTime--;
                updateDisplay();

                if (currentPhaseTime <= 0) {
                    handlePhaseComplete();
                }

                if (totalTime <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    startButton.textContent = 'Start';
                    alert('Timer complete!');
                }
            }
        }, 1000);
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        startButton.textContent = 'Start';
    }
});

// Initial display update
updateDisplay();
updateBreakDisplay();