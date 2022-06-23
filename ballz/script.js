canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
box = document.querySelector(".box");
bg = document.querySelector(".bg");
home = document.querySelector(".home");
scorecard = document.querySelector(".scorecard");
var jumpsound = new Audio('jump.wav');
var collide = new Audio('jump2.wav');
var health = new Audio('healthpickup.wav');
var balldied = new Audio('balldied.wav');




canvas.width = 800;
canvas.height = innerHeight;
let points = 0;
let highscore = 0;
your_score = document.querySelector("#your_score");
high_score = document.querySelector("#high_score");
touch = false;
// tryagain button
tryagain = document.querySelector(".tryagain");
//start button
start = document.querySelector(".start");

try {
  highscore = localStorage.getItem("highscore");
} catch {
  highscore = 0;
  localStorage.setItem("highscore", 0);
}

life = 1;
gamestart = false;
gameover = true;

function game_start() {
  canvas.classList.toggle("blur");
  bg.classList.toggle("blur");
  gamestart = true;
  home.style.zIndex = -1;
  scorecard.style.display = "none";
  life = 2;
  list_of_hearts = [];
  list_of_platform = [];
}
function game_over() {
  gamestart = false;
  // blur background
  your_score.innerText = `score: ${points}`;
  if(highscore<points){
    highscore = points;
  }
  high_score.innerText = `highscore: ${highscore}`;
  scorecard.style.display = "flex";
  canvas.classList.toggle("blur");
  bg.classList.toggle("blur");
}

start.addEventListener("click", ()=>{
  gamestart = true;
  home.style.zIndex = -1;
});
tryagain.addEventListener("click", game_start);

class ball {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.contact = false;
    this.left = false;
    this.right = false;
    this.jump = false;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class platform {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.contact = false;
  }
  draw() {
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class physics {
  constructor(gravity, speed, jump) {
    this.gravity = gravity;
    this.speed = speed;
    this.jump = jump;
  }
}

class heart {
  constructor(width, height) {
    this.x = Math.floor(Math.random() * width);
    this.y = Math.floor(Math.random() * height);
  }
  draw() {
    var heart = new Image();
    heart.src = "/heart-svgrepo-com (1).svg";
    ctx.drawImage(heart, this.x, this.y, 30, 30);
  }
}
list_of_platform = [];
list_of_hearts = [];
b = new ball(canvas.width / 2, 15, 15, "white");
ph = new physics(3, 2, 10);
console.log(ph);
createplatforms = setInterval(() => {
  if (gamestart) {
    p = new platform(
      Math.floor(Math.random() * (canvas.width - 120)),
      innerHeight,
      120,
      15,
      "#111"
    );
    list_of_platform.push(p);
  }
}, 1500);
setInterval(() => {
  h = new heart(canvas.width, canvas.height);
  list_of_hearts.push(h);
  console.log("pushed");
  setTimeout(() => {
    list_of_hearts.pop();
    console.log("poped");
  }, 8000);
}, 10000);

// main loop of the programe (120fps)
setInterval(() => {
  if (gamestart) {
    ctx.clearRect(0, 0, canvas.width, innerHeight);
    list_of_hearts.forEach((hearts) => {
      hearts.draw();
      if (Math.abs(hearts.x - b.x) <= 20) {
        if (Math.abs(hearts.y - b.y) <= 20) {
          health.play();
          life += 1;
          list_of_hearts.pop();
        }
      }
    });
    list_of_platform.forEach((e, i) => {
      e.y = e.y - ph.speed;
      if (
        b.y + b.radius >= e.y &&
        b.y + b.radius <= e.y + e.height &&
        b.x >= e.x &&
        b.x <= e.x + e.width
      ) {
        e.contact = true;
      } else {
        e.contact = false;
      }
      if (e.contact) {
        b.y = b.y - ph.speed;
      }
      e.draw();
      if (e.y <= 0) {
        list_of_platform.splice(i, 1);
        console.log(list_of_platform);
      }
    });

    // code for ball movement

    b.contact = false;
    list_of_platform.forEach((e) => {
      if (e.contact) {
        b.contact = true;
        if (!touch) {
          touch = true;
          collide.play();
        }
        points = points + 1;
      }
    });
    if (!b.contact && !b.jump) {
      b.y = b.y + ph.gravity;
      touch = false;
    }

    if (b.left && b.x - b.radius >= 0) {
      b.x = b.x - ph.speed;
    }
    if (b.right && b.x + b.radius < canvas.width) {
      b.x = b.x + ph.speed;
    }
    if (b.jump) {
      b.y = b.y - ph.jump;
    }

    if (b.y > innerHeight + b.radius) {
      life--;
      console.log(life);
      if (life == 0) {
        game_over();
      } else {
        b.y = b.radius;
        b.x = canvas.width / 2;
      }
    }
    b.draw();
  }
}, 1000 / 60);

document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) {
    console.log("left");
    b.left = true;
  }
  if (e.keyCode == 39) {
    console.log("right");
    b.right = true;
  }
});
document.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) {
    b.left = false;
  }
  if (e.keyCode == 39) {
    b.right = false;
  }
});
document.addEventListener("keypress", (e) => {
  if (e.keyCode == 32) {
    console.log("space");
    if (b.contact) {
      b.jump = true;
      jumpsound.play();
    }
  }
  setTimeout(() => {
    b.jump = false;
  }, 300);
});
window.addEventListener("deviceorientation", (e) => {
  if (e.gamma > 20) {
    b.right = true;
    b.left = false;
  }
  if(e.gamma>-20 && e.gamma<20){
    console.log("not moving ")
    b.right = false;
    b.left = false;
  }
  if (e.gamma < -20) {
    b.left = true;
    b.right = false;
  }
});
