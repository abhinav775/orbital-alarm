const earth = document.getElementById("earth");
const orbit = document.getElementById("orbit");
const alarmSound = document.getElementById("alarmSound");
const alarmTimeDisplay = document.getElementById("alarmTime");
let isDragging = false;
let alarmHour = null;
let alarmMinute = null;
orbit.addEventListener("mousedown", (e) => {
  isDragging = true;
});
document.addEventListener("mouseup", () => {
  isDragging = false;
});
