square = document.querySelectorAll(".square");
start = document.querySelector("#start");
let scorecard = document.querySelector(".scorecard");
let box = document.querySelector(".box");
let count = document.querySelector("#idcount");
let finalcard = document.createElement("div");
let scorenumber = document.createElement("div");
let tryagain = document.createElement("button");
let highestscore = document.createElement("div");
let highscore = 0;
tryagain.innerText = "Try Again";
tryagain.classList.add("tryagain");


// defining functions.
let glow = async (t, pos) => {
  setTimeout(() => {
    square[pos].classList.toggle("active");
    playsound(1 + pos%5);
  }, 1000 * t);
  setTimeout(() => {
    square[pos].classList.toggle("active");
  }, 1000 * t + 800);
};

// defining custom events
const round = new CustomEvent("round", { detail: { name: "roundcalled" } });
document.addEventListener("round", (e) => {
  for (let i = 0; i < b.length; i++) {
    templist[i] = b[i];
  }
  b.forEach((e, index) => {
    glow(index + 1, e);
  });
});

function playsound(a){
  let audio = new Audio(`sound${a}.wav`);
  audio.play();
}



gameNotStarted = true;
Started = false;
// start loop
start.addEventListener("click", () => {
  if (gameNotStarted) document.dispatchEvent(round);
  gameNotStarted = false;
  started = true;
});

b = [Math.floor(Math.random() * 16)];
templist = [];

square.forEach((e, i) => {
  e.addEventListener("click", () => {
    let target = i;
    if (templist.includes(target)) {
      playsound(1 + i%5);
      templist.splice(templist.indexOf(target), 1);
    } else {
      if (started) {
        sound = new Audio("gameover.wav");
        sound.play();
        scorecard.style.display = "none";
        box.style.display = "none";
        scorecard.classList.remove("animate");
        box.classList.remove("animate");  
        finalcard.classList.add("finalcard");
        finalcard.innerHTML = `<h1>Game Over</h1>`;
        scorenumber.innerHTML = `<h1>Your Score: ${b.length - 1}</h1>`;
        let container = document.querySelector(".container");

        if((b.length-1)>highscore){
          highscore = b.length-1;
        };
        highestscore.innerHTML = `<h1>Best Score: ${highscore}</h1>`;
        container.appendChild(finalcard);
        finalcard.appendChild(scorenumber);
        finalcard.appendChild(highestscore);
        finalcard.appendChild(tryagain);
      }
    }
    if (templist.length == 0) {
      count.innerHTML = `${b.length}`;
      b.push(Math.floor(Math.random() * 16));
      document.dispatchEvent(round);
    }
  });
});
tryagain.addEventListener("click", () => {
  scorecard.style.display = "flex";
  box.style.display = "grid";
  scorecard.classList.add("animate");
  box.classList.add("animate");
  finalcard.remove();
  gameNotStarted = true;
  Started = false;
  count.innerHTML = `0`;
  templist = [];
  b = [Math.floor(Math.random() * 16)];
});
