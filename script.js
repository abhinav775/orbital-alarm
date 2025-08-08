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

orbit.addEventListener("mousedown", (e) => {
  dragging = true;
  moveEarth(e);
});

document.addEventListener("mousemove", (e) => {
  if (dragging) moveEarth(e);
});

document.addEventListener("mouseup", () => dragging = false);

function moveEarth(e) {
  const angle = getAngleFromMouse(e.clientX, e.clientY);
  setEarthPosition(angle);
  const { h, m } = angleToTime(angle);
  alarmHour = h;
  alarmMin = m;
  alarmSet = false; // reset until user confirms
  timeDisplay.textContent = `Alarm Time: ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} (Not Set Yet)`;
}

// Set Alarm Button
setAlarmBtn.addEventListener("click", () => {
  if (alarmHour !== null && alarmMin !== null) {
    alarmSet = true;
    timeDisplay.textContent = `Alarm SET for: ${String(alarmHour).padStart(2, '0')}:${String(alarmMin).padStart(2, '0')}`;
  }
});

// Check time every second
setInterval(() => {
  if (!alarmSet) return;

  const now = new Date();
  if (
    alarmHour === now.getHours() &&
    alarmMin === now.getMinutes() &&
    now.getSeconds() === 0
  ) {
    alarmSound.play();
    alert("🌞 Alarm Time Reached!");
    alarmSet = false; // reset alarm after it rings
  }
}, 1000);

// Start with Earth at top (12:00 AM)
setEarthPosition(270);
