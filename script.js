const orbit = document.getElementById("orbit");
const earth = document.getElementById("earth");
const timeDisplay = document.getElementById("time");
const alarmSound = document.getElementById("alarm");
const setAlarmBtn = document.getElementById("setAlarmBtn");

const radius = 200;
const centerX = radius;
const centerY = radius;
let alarmHour = null;
let alarmMin = null;
let alarmSet = false;

let animationAngle = 270;
let rotating = false;
let animationFrameId = null;

// Ensure Earth dimensions are available
window.onload = () => {
  setEarthPosition(animationAngle); // Correct starting position
};

function setEarthPosition(angle) {
  const rad = angle * Math.PI / 180;
  const x = centerX + radius * Math.cos(rad) - earth.offsetWidth / 2;
  const y = centerY + radius * Math.sin(rad) - earth.offsetHeight / 2;
  earth.style.left = `${x}px`;
  earth.style.top = `${y}px`;
}

function getAngleFromMouse(x, y) {
  const dx = x - (orbit.getBoundingClientRect().left + centerX);
  const dy = y - (orbit.getBoundingClientRect().top + centerY);
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  return angle;
}

function angleToTime(angle) {
  const totalMinutes = Math.round((angle / 360) * 1440);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return { h, m };
}

// Drag Logic
let dragging = false;
let selectedHour = null;
let selectedMin = null;

orbit.addEventListener("mousedown", (e) => {
  if (rotating) return;
  dragging = true;
  moveEarth(e);
});

document.addEventListener("mousemove", (e) => {
  if (dragging && !rotating) moveEarth(e);
});

document.addEventListener("mouseup", () => dragging = false);

function moveEarth(e) {
  const angle = getAngleFromMouse(e.clientX, e.clientY);
  setEarthPosition(angle);
  animationAngle = angle;
  const { h, m } = angleToTime(angle);
  selectedHour = h;
  selectedMin = m;
  timeDisplay.textContent = `Alarm Time: ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

setAlarmBtn.addEventListener("click", () => {
  if (selectedHour !== null && selectedMin !== null) {
    alarmHour = selectedHour;
    alarmMin = selectedMin;
    alarmSet = true;
    rotating = true;
    alert(`✅ Alarm set for ${String(alarmHour).padStart(2, '0')}:${String(alarmMin).padStart(2, '0')}`);
    animateEarth();
  }
});

function animateEarth() {
  if (!rotating) return;
  animationAngle = (animationAngle + 0.2) % 360;
  setEarthPosition(animationAngle);
  animationFrameId = requestAnimationFrame(animateEarth);
}

// ⏰ Alarm check + math until wrong
setInterval(() => {
  if (!alarmSet) return;

  const now = new Date();
  if (
    alarmHour === now.getHours() &&
    alarmMin === now.getMinutes() &&
    now.getSeconds() === 0
  ) {
    alarmSet = false;
    rotating = false;
    cancelAnimationFrame(animationFrameId);
    alarmSound.play();
    askMathUntilWrong();
  }
}, 1000);

function askMathUntilWrong() {
  // Create overlay elements dynamically
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0, 0, 0, 0.85)';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';

  const questionBox = document.createElement('div');
  questionBox.style.background = '#111';
  questionBox.style.color = 'white';
  questionBox.style.padding = '20px';
  questionBox.style.borderRadius = '10px';
  questionBox.style.textAlign = 'center';

  const questionText = document.createElement('div');
  questionText.style.fontSize = '1.5em';
  questionText.style.marginBottom = '10px';

  const input = document.createElement('input');
  input.type = 'number';
  input.style.padding = '10px';
  input.style.fontSize = '1.2em';
  input.style.borderRadius = '5px';
  input.style.border = 'none';
  input.style.marginBottom = '10px';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Submit';
  submitBtn.style.padding = '10px 20px';
  submitBtn.style.fontSize = '1em';
  submitBtn.style.borderRadius = '8px';
  submitBtn.style.border = 'none';
  submitBtn.style.background = '#0af';
  submitBtn.style.color = 'white';
  submitBtn.style.cursor = 'pointer';

  questionBox.appendChild(questionText);
  questionBox.appendChild(input);
  questionBox.appendChild(submitBtn);
  overlay.appendChild(questionBox);
  document.body.appendChild(overlay);

  function generateQuestion() {
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const op = Math.random() < 0.5 ? '+' : '-';
    const correct = op === '+' ? a + b : a - b;
    return { question: `${a} ${op} ${b}`, answer: correct };
  }

  let { question, answer } = generateQuestion();
  questionText.textContent = `🧠 Solve: ${question}`;
  input.value = '';

  submitBtn.onclick = () => {
    const userInput = parseInt(input.value);
    if (userInput !== answer) {
      alarmSound.pause();
      alarmSound.currentTime = 0;
      document.body.removeChild(overlay);
      alert("🚨 Wrong answer. Alarm stopped.");
    } else {
      // Refresh question
      alert("✅ Correct! Try again.");
      ({ question, answer } = generateQuestion());
      questionText.textContent = `🧠 Solve: ${question}`;
      input.value = '';
    }
  };
}
