var timer = document.getElementById("timer");
var startButton = document.getElementById("startButton");
var resetButton = document.getElementById("resetButton");
var addTimerButton = document.getElementById("addTimerButton");
var loopCheckbox = document.getElementById("loopCheckbox");
var timerDisplay = document.getElementsByClassName("timerDisplay");
let pauseButton = document.getElementById("pauseButton");
let listTimers = document.getElementById("timersContent");
let maxMinButton = document.getElementById("maxMinButton");
let toHideHTML = document.getElementsByClassName("toHide");
let showButton = document.getElementById("showButton");
let closeButton = document.getElementById("close");
let minButton = document.getElementById("minimize");
let maxButton = document.getElementById("maximize");
let titleBarHTML = document.getElementById("titleBar");
let volumeBar = document.getElementById("volume-bar");
let volumeIndicator = document.getElementById("volume-indicator");
let volumeLabel = document.querySelector(".volume-label");

let soundNotif = new Audio();
soundNotif.src = "rain.mp3";
const fade_step = soundNotif.volume / (1000 / 10);
soundNotif.volume = 0.5; // 0 to 1 max sound power
const originalVolume = soundNotif.volume;

var intervalIds = [];
var currentIntervalId;
var loopEnabled = true;
let iTimer = 0;
let timerNow = "";
let secTimer = 0;
let canContinue = false;
let hide = false;
let backupTimer = 0
let firstTime = true

function startTimers(secTimer) {
  secTimer--;
  
  timerDisplay[iTimer].innerHTML = toHHMMSS(secTimer);
  backupTimer = secTimer;
  currentIntervalId = setInterval(function () {
    secTimer--;

    //minuteur fini
    if (secTimer < 0) {
      timerDisplay[iTimer].innerHTML = toHHMMSS(intervalIds[iTimer]);

      clearInterval(currentIntervalId);
      canContinue = true;
      window.electronAPI.showNotif();
      soundNotif.play();
      setTimeout(fadeOut, 2000);
      //si c'est pas le dernier minuteur
      if (iTimer < intervalIds.length - 1) {
        if (hide) {
          timerDisplay[iTimer].style.display = "none";
        }
        iTimer++;

        timerDisplay[iTimer].style.display = "flex";
      } else {
        if (hide) {
          timerDisplay[iTimer].style.display = "none";
          timerDisplay[0].style.display = "flex";
        }
        iTimer = 0;

        if (!loopEnabled) {
          canContinue = false;
        }
      }
      return;
    }
    timerDisplay[iTimer].innerHTML = toHHMMSS(secTimer);
    backupTimer = secTimer;
  }, 1000);
}

function fadeOut() {
  if (soundNotif.volume > 0) {
    if (soundNotif.volume - fade_step > 0) {
      soundNotif.volume -= fade_step;
    } else {
      soundNotif.volume = 0;
    }

    setTimeout(fadeOut, 10);
  } else {
    soundNotif.pause();
    soundNotif.volume = originalVolume;
  }
}

function stopTimer() {
  clearInterval(currentIntervalId);
  intervalIds = [];
}

startButton.addEventListener("click", function () {
  clearInterval(currentIntervalId);
    startButton.disabled = true;
    pauseButton.disabled = false;
    resetButton.disabled = false;

  if (intervalIds.length > 0) {
    for (let i = 0; i < intervalIds.length; i++) {
      timerDisplay[i].innerHTML = toHHMMSS(intervalIds[i]);
    }
    if (firstTime){
        startTimers(intervalIds[iTimer]);
        firstTime = false
    }
    else
        startTimers(backupTimer)
  } else {
    console.log("No timer exists");
  }

});

maxMinButton.addEventListener("click", function () {
  if (intervalIds.length) {
    hide = true;
    showButton.style.display = "flex";
    titleBarHTML.style.justifyContent = "space-between";
    //on selectionne toutes classes à cacher pour les cacher
    for (let i = 0; i < toHideHTML.length; i++) {
      toHideHTML[i].style.display = "none";
    }
    timerDisplay[iTimer].style.display = "flex";
    window.electronAPI.setMainWin();
  } else {
    console.log("No timer exists");
  }
});

showButton.addEventListener("click", function () {
  if (hide) {
    showButton.style.display = "none";
    titleBarHTML.style.justifyContent = "flex-end";
    for (let i = 0; i < toHideHTML.length; i++) {
      if (i <= 3) {
        toHideHTML[i].style.display = "inline";
      } else {
        toHideHTML[i].style.display = "flex";
      }
    }
    window.electronAPI.setFocusWin();
  }

  hide = false;
});

pauseButton.addEventListener("click", function () {
  clearInterval(currentIntervalId);
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = false;
});

resetButton.addEventListener("click", function () {
  stopTimer();
  firstTime = true;
    startButton.disabled = false;
    pauseButton.disabled = true;
    resetButton.disabled = true;
  timerDisplay.textContent = "00:00:00";
  listTimers.innerHTML = "";
});

addTimerButton.addEventListener("click", function () {
  if (timer.value > 0) {
    var duration = timer.value * 60;
    intervalIds.push(duration);
    displayTimers();
  } else {
    console.log("Change timer time");
  }
});

window.electronAPI.runNextTimer(() => {
  soundNotif.pause();
  //Play sound between 0 and 14min next time
  soundNotif.currentTime = Math.random() * 840;
  if (canContinue) {
    startTimers(intervalIds[iTimer]);
    canContinue = false;
  }
});

loopCheckbox.addEventListener("change", function () {
  loopEnabled = loopCheckbox.checked;
});

function displayTimers() {
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < intervalIds.length; i++) {
    let newLi = document.createElement("li");
    let newText = document.createTextNode(toHHMMSS(intervalIds[i]));
    newLi.appendChild(newText);

    newLi.setAttribute("class", "timerDisplay");
    newLi.classList.add("toHide");

    fragment.appendChild(newLi);
  }

  listTimers.innerHTML = "";
  listTimers.appendChild(fragment); // Ajoute le document fragment contenant tous les éléments li au DOM
}

function toHHMMSS(secondes) {
  var sec_num = parseInt(secondes, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}

closeButton.addEventListener("click", function () {
  console.log("close");
  window.electronAPI.closeWindows();
});

minButton.addEventListener("click", function () {
  console.log("min");
  window.electronAPI.minimizeWindows();
});

maxButton.addEventListener("click", function () {
  console.log("max");
  window.electronAPI.maximizeWindows();
});

volumeBar.addEventListener("click", function (event) {
  updateVolume(event);
});

volumeBar.addEventListener("mousedown", function (event) {
  document.addEventListener("mousemove", updateVolume);
});

document.addEventListener("mouseup", function (event) {
  document.removeEventListener("mousemove", updateVolume);
});

function updateVolume(event) {
  let volume =
    (event.clientX - volumeBar.getBoundingClientRect().left) /
    volumeBar.offsetWidth;
  if (volume > 1) {
    volume = 1;
  }
  if (volume < 0) {
    volume = 0;
  }
  console.log(volume);
  soundNotif.volume = volume;
  volumeIndicator.style.left = volume * 100 + "%";
  volumeBar.setAttribute("aria-valuenow", volume * 100);
  volumeLabel.textContent = Math.round(volume * 100) + "%";

  // Désactive la modification du son lorsque l'utilisateur relâche le clic de la souris
  if (event.type === "mouseup") {
    document.removeEventListener("mousemove", updateVolume);
  }
}
