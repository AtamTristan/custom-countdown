const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl = document.getElementById('complete');
const completeInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set Date Input minimum with today's date
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);



// Populate Countdown / Complete UI
function updateDom(){
    countdownActive = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownValue - now;

        const days = Math.floor(distance / day);
        const hours = Math.floor((distance % day) / hour);
        const minutes = Math.floor((distance % hour) / minute);
        const seconds = Math.floor((distance % minute) / second);

        // Hide Input
        inputContainer.hidden = true;

    // if countdown has ended, show complete
        if (distance < 0){
            countdownEl.hidden = true;
            clearInterval(countdownActive);
            completeInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
            completeEl.hidden = false;
        }else {
            // Else show coundown in progress
            countdownElTitle.textContent = `${countdownTitle}`;
            timeElements[0].textContent = `${days}`;
            timeElements[1].textContent = `${hours}`;
            timeElements[2].textContent = `${minutes}`;
            timeElements[3].textContent = `${seconds}`;
            completeEl.hidden = true;
            countdownEl.hidden = false;
        }
    },second);
}

// Takes Values from Form Input
function updateCountdown(e){
    e.preventDefault();
    countdownTitle = e.srcElement[0].value;
    countdownDate = e.srcElement[1].value;
    savedCountdown = {
        title: countdownTitle,
        date: countdownDate,
    };
    localStorage.setItem('countdown',JSON.stringify(savedCountdown));
    if (countdownDate === ''){
        alert('Please select a date for the Countdown');
    }else {
        // get the number version of the current date, updateDom
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }
}

// Reset all values
function reset() {
    // Hidden countdowns, show Input
    countdownEl.hidden = true;
    completeEl.hidden = true;
    inputContainer.hidden = false;
    // Stop the countdown
    clearInterval(countdownActive);
    // Reset Values
    countdownTitle = '';
    countdownDate = '';
    localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
    // Get Countdown from local Storage if available
    if (localStorage.getItem('countdown')){
        inputContainer.hidden = true;
        savedCountdown = JSON.parse(localStorage.getItem('countdown'));
        countdownTitle = savedCountdown.title;
        countdownDate = savedCountdown.date;
        countdownValue = new Date(countdownDate).getTime();
        updateDom();
    }

    
}

// Event Listener
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click',reset);
completeBtn.addEventListener('click', reset);

// on Load
restorePreviousCountdown();

// Element für Zustimmung
const consentOverlay = document.getElementById('consent-overlay');
const consentButton = document.getElementById('consent-button');

// Funktion zum Anzeigen des Zustimmungs-Overlays
function showConsent() {
    if (!localStorage.getItem('consentGiven')) {
        consentOverlay.classList.add('show');
    }
}

// Event Listener für den Zustimmungs-Button
consentButton.addEventListener('click', () => {
    localStorage.setItem('consentGiven', 'true');
    consentOverlay.classList.remove('show');
});

// Beim Laden
showConsent();
