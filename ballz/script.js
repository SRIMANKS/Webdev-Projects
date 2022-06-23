canvas = document.querySelector("canvas");
ctx = canvas.getContext("2d");
box = document.querySelector(".box");
bg = document.querySelector(".bg");
canvas.width = 800;
canvas.height = innerHeight;
let points = 0;
let highscore = 0;
touch = false;
btn = document.createElement("button");
btn.innerText = "tryagain";
btn.classList.add("tryagain");
start = document.querySelector(".start");
home = document.querySelector(".home");
score = document.querySelector(".score");

start.addEventListener("click", game_start);
try {
  highscore = localStorage.getItem("highscore");
} catch {
  highscore = 0;
  localStorage.setItem("highscore", 0);
}
life = 1;
gamestart = false;
gameover = true;

path = document.querySelectorAll("path");
path.forEach(function (item) {
  console.log(item.getTotalLength());
});

function game_over() {
  gameover = true;
  scorecard = document.createElement("div");
  scorecard.innerHTML = "Game Over";
  yourscore = document.createElement("div");
  yourscore.innerHTML = `<h1>YourScore: ${points}</h1>`;
  highscore = document.createElement("div");
  highscore.innerHTML = `<h1>Highscore: ${highscore}</h1>`;
  scorecard.classList.add("scorecard");
  scorecard.appendChild(score);
  scorecard.appendChild(highscore);
  scorecard.appendChild(btn);
  canvas.classList.add("gameover");
  bg.classList.add("gameover");
  box.appendChild(scorecard);
}
function game_start(a) {
  console.log(a);
  home.style.zIndex = "-5";
  gameover = false;
  canvas.classList.remove("gameover");
  bg.classList.remove("gameover");
  box.removeChild(scorecard);
  points = 0;
  touch = false;
  b.y = b.radius;
  b.x = canvas.width / 2;
  life = 1;
  list_of_platform = [];
}

function distance(a, b, c, d) {
  return Math.sqrt(Math.pow(a - b, 2) + Math.pow(c - d, 2));
}

btn.addEventListener("click", game_start);

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
setInterval(() => {
  if (!gameover) {
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
  if (!gameover) {
    ctx.clearRect(0, 0, canvas.width, innerHeight);
    list_of_hearts.forEach((hearts) => {
      hearts.draw();
      if (Math.abs(hearts.x - b.x)<=20){
        if(Math.abs(hearts.y - b.y)<=20){
        life+=1;  
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
        }
        console.log("Called");
        points = points + 1;
        score.innerText = `score: ${points}`;
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
  if (e.gamma < -20) {
    b.left = true;
    b.right = false;
  }
});
