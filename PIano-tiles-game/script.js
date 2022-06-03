// dom elements required for the game.
square = document.querySelectorAll(".square");
hardsquare = document.querySelectorAll(".hardsquare");
start = document.querySelector("#start");
scorecard = document.querySelector(".scorecard");
box = document.querySelector(".box");
hardbox = document.querySelector(".hardbox");
count = document.querySelector("#idcount");
finalcard = document.createElement("div");
scorenumber = document.createElement("div");
tryagain = document.createElement("button");
highestscore = document.createElement("div");
easy = document.querySelector(".easy");
hard = document.querySelector(".hard");
end = document.getElementById("end");
tryagain.innerText = "Try Again";
tryagain.classList.add("tryagain");

// using local storage to store highscores.
try{
console.log(window.localStorage.getItem("highscore_easy"));
}
catch(e){
  window.localStorage.setItem("highscore_easy",0);
}
try{
  console.log(window.localStorage.getItem("highscore_hard"));
}
catch(e){
  window.localStorage.setItem("highscore_hard",0);
}

// variables
starttimer = new Date().getTime();
timeelapsed = 0;
gameNotStarted = true;
Started = false;
can_user_play = false;
let mode = "";
changemode("easy");

// lists
b = [Math.floor(Math.random() * 16)];
c = [Math.floor(Math.random() * 36)];
templist = [];


// function to change mode of the game. 
function changemode(m) {
  if (m === "easy") {
    easy.classList.add("easymode");
    hard.classList.remove("hardmode");
    box.style.display = "grid";
    hardbox.style.display = "none";
    mode = "easy";
  }
  if (m === "hard") {
    hard.classList.add("hardmode");
    easy.classList.remove("easymode");
    hardbox.style.display = "grid";
    box.style.display = "none";
    mode = "hard";
    console.log(mode);
  }
}

easy.addEventListener("click", () => {
  if (gameNotStarted) {
    changemode("easy");
  }
});
hard.addEventListener("click", () => {
  if (gameNotStarted) {
    changemode("hard");
  }
});

// glow function to make the tiles glow for each round with a delay.
let glow = async (mode, t, pos) => {
  if (mode === "easy") {
    setTimeout(() => {
      square[pos].classList.toggle("active");
      playsound(1 + (pos % 5));
    }, 1000 * t);
    setTimeout(() => {
      square[pos].classList.toggle("active");
    }, 1000 * t + 800);
  } else if (mode == "hard") {
    setTimeout(() => {
      hardsquare[pos].classList.toggle("active");
      playsound(1 + (pos % 5));
    }, 1000 * t);
    setTimeout(() => {
      hardsquare[pos].classList.toggle("active");
    }, 1000 * t + 800);
  }
};

// defining custom events for the game.
const roundeasy = new CustomEvent("roundeasy", {
  detail: { name: "roundeasy" },
});
document.addEventListener("roundeasy", (e) => {
  for (let i = 0; i < b.length; i++) {
    templist[i] = b[i];
  }
  b.forEach((e, index) => {
    glow("easy", index + 1, e);
  });
  setTimeout(() => {
    can_user_play = true;
  }, 1000 * b.length);
});
// defining custom events for the game.
const roundhard = new CustomEvent("roundhard", {
  detail: { name: "roundhard" },
});
document.addEventListener("roundhard", (e) => {
  console.log(c);
  for (let i = 0; i < c.length; i++) {
    templist[i] = c[i];
  }
  c.forEach((e, index) => {
    console.log("target", e);
    glow("hard", index + 1, e);
  });
  setTimeout(() => {
    can_user_play = true;
    starttimer = new Date().getTime();
  }, 1000 * c.length);
});

// function to play sound on click event
function playsound(a) {
  let audio = new Audio(`sound${a}.wav`);
  audio.play();
}
// start game and intialization
start.addEventListener("click", () => {
  if (gameNotStarted) {
    if (mode === "easy") {
      console.log("easymode");
      document.dispatchEvent(roundeasy);
    }
    if (mode === "hard") {
      console.log("hardmode");
      document.dispatchEvent(roundhard);
    }
    gameNotStarted = false;
    started = true;
  }
});

// main loop for player to select tiles in easy mode. 
//the loop terminates of the user selects all the tiles.
// and the gameover card is created.

square.forEach((e, i) => {
  e.addEventListener("click", () => {
    if (can_user_play && mode === "easy") {
      let target = i;
      if (templist.includes(target)) {
        playsound(1 + (i % 5));
        templist.splice(templist.indexOf(target), 1);
      } else {
        if (started) {
          sound = new Audio("gameover.wav");
          sound.play();
          scorecard.style.display = "none";
          box.style.display = "none";
          end.style.display = "none";
          scorecard.classList.remove("animate");
          box.classList.remove("animate");
          finalcard.classList.add("finalcard");
          finalcard.innerHTML = `<h1>Game Over</h1>`;
          scorenumber.innerHTML = `<h1>Your Score: ${b.length - 1}</h1>`;
          let container = document.querySelector(".container");

          if (b.length - 1 > window.localStorage.getItem("highscore_easy")) {
            window.localStorage.setItem("highscore_easy", b.length - 1);
          }
          highestscore.innerHTML = `<h1>Highest Score: ${
            window.localStorage.getItem("highscore_easy")
          }</h1>`;
          container.appendChild(finalcard);
          finalcard.appendChild(scorenumber);
          finalcard.appendChild(highestscore);
          finalcard.appendChild(tryagain);
        }
      }
      if (templist.length == 0) {
        can_user_play = false;
        count.innerHTML = `${b.length}`;
        b.push(Math.floor(Math.random() * 16));
        document.dispatchEvent(roundeasy);
      }
    }
  });
});
// main loop for player to select tiles in hard mode. 
//the loop terminates of the user selects all the tiles in the correct order.
// and the gameover card is created.

hardsquare.forEach((e, i) => {
  e.addEventListener("click", () => {
    if (can_user_play && mode === "hard") {
      let target = i;
      if (target === templist[0]) {
        playsound(1 + (i % 5));
        templist.splice(0, 1);
      } else {
        if (started) {
          sound = new Audio("gameover.wav");
          sound.play();
          scorecard.style.display = "none";
          hardbox.style.display = "none";
          end.style.display = "none";
          scorecard.classList.remove("animate");
          hardbox.classList.remove("animate");
          finalcard.classList.add("finalcard");
          finalcard.innerHTML = `<h1>Game Over</h1>`;
          fscore = (c.length - 1) * 10 - timeelapsed / 1000;
          scorenumber.innerHTML = `<div>Your Score: ${
            (c.length - 1) * 10
          }</div><div>Time Taken: ${
            timeelapsed / 1000
          }</div><div> Final score: ${fscore}</div>`;
          let container = document.querySelector(".container");
          // highscore is caluclated and stored..  
          if (fscore > highscore_hard) {
            highscore_hard = fscore;
          }
          highestscore.innerHTML = `<h1>Best Score(hard): ${highscore_hard}</h1>`;
          container.appendChild(finalcard);
          finalcard.appendChild(scorenumber);
          finalcard.appendChild(highestscore);
          finalcard.appendChild(tryagain);
        }
      }
      if (templist.length == 0) {
        can_user_play = false;
        endtimer = new Date().getTime();
        timeelapsed = timeelapsed + endtimer - starttimer;// time taken for the player to finish each round is calculated.
        console.log(timeelapsed);
        count.innerHTML = `${c.length * 10}`;
        c.push(Math.floor(Math.random() * 36));
        document.dispatchEvent(roundhard);
      }
    }
  });
});

// a tryagain button to loop the game so the player can play without refreshing.

tryagain.addEventListener("click", () => {
  gameNotStarted = true;
  Started = false;
  scorecard.style.display = "flex";
  end.style.display = "flex";
  if(mode==="easy"){
    box.style.display = "grid";
  }
  else if(mode==="hard"){
    hardbox.style.display = "grid";
  }

  scorecard.classList.add("animate");
  box.classList.add("animate");
  finalcard.remove();
  gameNotStarted = true;
  Started = false;
  count.innerHTML = `0`;

  // lists are emptied and the game is reseted
  templist = [];
  b = [Math.floor(Math.random() * 16)];
  c = [Math.floor(Math.random() * 36)];
});
