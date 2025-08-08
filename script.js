const orbit = document.querySelector(".orbit");
const alarmSound = document.getElementById("alarmSound");
const setAlarmBtn = document.getElementById("setAlarmBtn");

let alarmAngle = null;
let isAlarmSet = false;

orbit.addEventListener("click", (e) => {
  const rect = orbit.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
  alarmAngle = (angle * 180 / Math.PI + 360) % 360;

  alert(`Alarm time set at angle: ${Math.round(alarmAngle)}°\nNow click "Set Alarm" to start`);
});

setAlarmBtn.addEventListener("click", () => {
  if (alarmAngle === null) {
    alert("Click on orbit to set alarm time.");
    return;
  }
  isAlarmSet = true;
  alert("Alarm is set! Earth must reach that position to ring.");
});

// Continuously check Earth's position
let lastAngle = 0;
setInterval(() => {
  if (!isAlarmSet) return;

  const computedStyle = window.getComputedStyle(orbit);
  const transform = computedStyle.transform;

  if (transform !== "none") {
    const values = transform.split("(")[1].split(")")[0].split(",");
    const a = values[0], b = values[1];
    const angle = Math.atan2(b, a) * (180 / Math.PI);
    const currentAngle = (angle + 360) % 360;

    // When Earth reaches or passes the alarm angle
    if (
      alarmAngle !== null &&
      Math.abs(currentAngle - alarmAngle) < 2 &&
      Math.abs(currentAngle - lastAngle) > 1
    ) {
      alarmSound.play();
      isAlarmSet = false;
      alert("⏰ Alarm Ringing!");
    }

    lastAngle = currentAngle;
  }
}, 100);
