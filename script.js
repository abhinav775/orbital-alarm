const earth = document.getElementById('earth');
const selectedTimeDisplay = document.getElementById('selected-time');
const setAlarmBtn = document.getElementById('set-alarm');
const alarmAudio = document.getElementById('alarm-audio');
const alarmModal = document.getElementById('alarm-modal');
const mathQuestion = document.getElementById('math-question');
const answerInput = document.getElementById('answer');
const submitAnswer = document.getElementById('submit-answer');

let alarmTime = null;
let isDragging = false;
let center = { x: 150, y: 150 };

// --- Drag to Set Time by Angle ---
earth.addEventListener('mousedown', () => isDragging = true);
document.addEventListener('mouseup', () => isDragging = false);
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  let dx = e.clientX - (earth.offsetParent.offsetLeft + center.x);
  let dy = e.clientY - (earth.offsetParent.offsetTop + center.y);
  let angle = Math.atan2(dy, dx);

  let radius = 150;
  let x = center.x + radius * Math.cos(angle) - 15;
  let y = center.y + radius * Math.sin(angle) - 15;

  earth.style.left = `${x}px`;
  earth.style.top = `${y}px`;

  // Convert angle to time (0 to 24h)
  let degrees = angle * (180 / Math.PI);
  degrees = (degrees + 360 + 90) % 360; // Align 0 deg to top
  let totalMinutes = Math.floor((degrees / 360) * 1440);
  let hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  let mm = String(totalMinutes % 60).padStart(2, '0');
  selectedTimeDisplay.textContent = `${hh}:${mm}`;
  alarmTime = `${hh}:${mm}`;
});

// --- Alarm Checker ---
setInterval(() => {
  const now = new Date();
  let hh = String(now.getHours()).padStart(2, '0');
  let mm = String(now.getMinutes()).padStart(2, '0');
  let currentTime = `${hh}:${mm}`;

  if (alarmTime && currentTime === alarmTime) {
    ringAlarm();
    alarmTime = null; // prevent repeating
  }
}, 1000);

// --- Set Alarm ---
setAlarmBtn.addEventListener('click', () => {
  if (alarmTime) {
    alert(`Alarm set for ${alarmTime}`);
  } else {
    alert("Rotate Earth to set time!");
  }
});

// --- Alarm Logic ---
function ringAlarm() {
  alarmAudio.play();
  alarmModal.classList.remove('hidden');
  generateMathQuestion();
}

function generateMathQuestion() {
  const a = Math.floor(Math.random() * 10 + 1);
  const b = Math.floor(Math.random() * 10 + 1);
  mathQuestion.textContent = `${a} + ${b} = ?`;
  answerInput.dataset.correct = a + b;
}

submitAnswer.addEventListener('click', () => {
  const userAnswer = parseInt(answerInput.value);
  const correct = parseInt(answerInput.dataset.correct);

  // Here's the "useless twist" – alarm only stops on wrong answer
  if (userAnswer !== correct) {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    alarmModal.classList.add('hidden');
    alert("Wrong! Alarm turned off! 😂");
  } else {
    alert("Correct? Nice try. Alarm keeps ringing!");
  }
});
