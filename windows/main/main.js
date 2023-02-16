var timer = document.getElementById("timer");
var startButton = document.getElementById("startButton");
var resetButton = document.getElementById("resetButton");
var addTimerButton = document.getElementById("addTimerButton");
var loopCheckbox = document.getElementById("loopCheckbox");
var timerDisplay = document.getElementsByClassName("timerDisplay");
let listTimers = document.getElementById("timersContent");
let continueButton = document.getElementById("continueButton");
let hideButton = document.getElementById("hideButton");
let toHideHTML = document.getElementsByClassName('toHide');
let showButton = document.getElementById("showButton");
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
      //si c'est pas le dernier minuteur
      if (iTimer < intervalIds.length - 1) {
        if(hide){
          timerDisplay[iTimer].style.display = 'none';
        }
        iTimer++;
        timerDisplay[iTimer].style.display = 'inline';
        
        //startTimers(intervalIds[iTimer]);
        
      } else {
        if(hide){
          timerDisplay[iTimer].style.display = 'none';
          timerDisplay[0].style.display = 'inline';
        }
        iTimer = 0;

        if (!loopEnabled) {
          canContinue = false
        }
      }
      return;
    }
    //minuteur fini

    timerDisplay[iTimer].innerHTML = toHHMMSS(secTimer);
  }, 1000);
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
    console.log("Aucun minuteur ajouté");
  }
});


hideButton.addEventListener("click", function () {
  hide = true;
  console.log(toHideHTML.length);
  //on selectionne toutes classes à cacher pour les cacher
  for (let i = 0; i < toHideHTML.length; i++) {
    toHideHTML[i].style.display = 'none';
  }
  timerDisplay[iTimer].style.display = 'inline';
});

showButton.addEventListener("click", function () {
  hide = false;
  for (let i = 0; i < toHideHTML.length; i++) {
    toHideHTML[i].style.display = 'inline';
  }
  
});




continueButton.addEventListener("click", function () {
  if(canContinue){
    startTimers(intervalIds[iTimer]);
    canContinue = false;
  }
});


resetButton.addEventListener("click", function () {
  stopTimer();
  timerDisplay.textContent = "00:00:00";
  listTimers.innerHTML = "";
});


addTimerButton.addEventListener("click", function () {
  if (timer.value > 0) {
    var duration = timer.value;
    intervalIds.push(duration);
    displayTimers();
    console.log(intervalIds);
  } else {
    console.log("Minuteur vide");
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

    console.log(newLi);
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
