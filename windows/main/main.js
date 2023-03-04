
var timer = document.getElementById("timer");
var startButton = document.getElementById("startButton");
var resetButton = document.getElementById("resetButton");
var addTimerButton = document.getElementById("addTimerButton");
var loopCheckbox = document.getElementById("loopCheckbox");
var timerDisplay = document.getElementsByClassName("timerDisplay");
let listTimers = document.getElementById("timersContent");
let hideButton = document.getElementById("hideButton");
let toHideHTML = document.getElementsByClassName("toHide");
let showButton = document.getElementById("showButton");
let closeButton = document.getElementById("close");
let minButton = document.getElementById("minimize");
let maxButton = document.getElementById("maximize");
let titleBarHTML = document.getElementById("titleBar");
let soundNotif = new Audio();
soundNotif.src = "rain.mp3";
const fade_step = soundNotif.volume / (1000 / 10);
const originalVolume = soundNotif.volume;


var intervalIds = [];
var currentIntervalId;
var loopEnabled = false;
let iTimer = 0;
let timerNow = "";
let secTimer = 0;
let canContinue = false;
let hide = false;

function startTimers(secTimer) {
  secTimer--;

  timerDisplay[iTimer].innerHTML = toHHMMSS(secTimer);

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
  }, 1000);
}

function fadeOut() {
  if (soundNotif.volume > 0) {
    if (soundNotif.volume - fade_step > 0){
      soundNotif.volume -= fade_step;
    }
    else{
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

  iTimer = 0;
  if (intervalIds.length > 0) {
    for (let i = 0; i < intervalIds.length; i++) {
      timerDisplay[i].innerHTML = toHHMMSS(intervalIds[i]);
    }
    startTimers(intervalIds[0]);
  } else {
    console.log("No timer exists");
  }
});

hideButton.addEventListener("click", function () {
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
  }
  else{
    console.log("No timer exists");
  }
});

showButton.addEventListener("click", function () {
  if (hide) {
    showButton.style.display = "none";
    titleBarHTML.style.justifyContent = "flex-end";
    for (let i = 0; i < toHideHTML.length; i++) {
      if(i <= 3){
        toHideHTML[i].style.display = "inline";
      }else{
        toHideHTML[i].style.display = "flex";
      }
    }
    window.electronAPI.setFocusWin();
  }

  hide = false;
});

resetButton.addEventListener("click", function () {
  stopTimer();
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
})

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

