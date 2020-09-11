const MAX_ENEMY = 10;
const HEIGHT_ENEM = 100;

const game = document.querySelector(".game"),
  score = document.querySelector(".score"),
  start = document.querySelector(".start"),
  gameArea = document.querySelector(".gameArea"),
  car = document.createElement("div");

const audio = document.createElement("embed");

// audio.src = "mario.mp3";
// audio.type = "audio/mp3";
// audio.style.cssText = `position: absolute; bottom: 150px;`;

car.classList.add("car");
const countSection = Math.floor(
  document.documentElement.clientHeight / HEIGHT_ENEM
);
gameArea.style.height = countSection * HEIGHT_ENEM;

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false,
};

const setting = {
  start: false,
  score: 0,
  speed: 0,
  traffic: 0,
};
topScore.textContent = localStorage.getItem("nfs_score", setting.score)
  ? localStorage.getItem("nfs_score", setting.score)
  : 0;
const addLocalStorage = () => {
  localStorage.setItem("nfs_score", setting.score);
  topScore.textContent = setting.score;
};

function getQuantityElements(heightElement) {
  return gameArea.offsetHeight / heightElement + 1;
}

function startGame(event) {
  const target = event.target;
  if (target === start) return;
  switch (target.id) {
    case "easy":
      setting.speed = 3;
      setting.traffic = 5;
      break;
    case "medium":
      setting.speed = 5;
      setting.traffic = 4;
      break;
    case "hard":
      setting.speed = 7;
      setting.traffic = 3;
      break;
  }
  start.classList.add("hide");
  game.classList.remove("game_over");
  game.classList.add("fon");
  gameArea.innerHTML = "";
  car.style.left = "125px";
  car.style.top = "auto";
  car.style.bottom = "10px";
  for (let i = 0; i < getQuantityElements(HEIGHT_ENEM); i++) {
    const line = document.createElement("div");
    line.classList.add("line");
    line.style.height = HEIGHT_ENEM / 2 + "px";
    line.style.top = `${i * HEIGHT_ENEM}px`;
    line.y = i * HEIGHT_ENEM;
    gameArea.append(line);
  }

  for (let i = 0; i < getQuantityElements(HEIGHT_ENEM * setting.traffic); i++) {
    const enemy = document.createElement("div");
    const randomEnemy = Math.floor(Math.random() * MAX_ENEMY) + 1;
    enemy.classList.add("enemy");
    enemy.y = -HEIGHT_ENEM * setting.traffic * (i + 1);
    enemy.style.left =
      Math.floor(Math.random() * gameArea.offsetWidth - HEIGHT_ENEM / 2) + "px";
    enemy.style.top = enemy.y + "px";
    enemy.style.background = `transparent url("./image/enemy${randomEnemy}.png") center / cover no-repeat`;
    gameArea.append(enemy);
  }

  setting.score = 0;
  setting.start = true;
  gameArea.append(car);
  document.body.append(audio);
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed;
    score.innerHTML = "РЕЗУЛЬТАТ:<br>" + setting.score;
    moveRoad();
    moveEnemy();

    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed;
    }

    if (keys.ArrowRight && setting.x < gameArea.offsetWidth - 50) {
      setting.x += setting.speed;
    }

    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed;
    }

    if (
      keys.ArrowDown &&
      setting.y < gameArea.offsetHeight - car.offsetHeight
    ) {
      setting.y += setting.speed;
    }

    car.style.left = setting.x + "px";
    car.style.top = setting.y + "px";

    requestAnimationFrame(playGame);
  }
}

function startRun(event) {
  event.preventDefault();

  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = true;
  }
}

function stopRun(event) {
  event.preventDefault();

  if (keys.hasOwnProperty(event.key)) {
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll(".line");
  lines.forEach(function (line) {
    line.y += setting.speed;
    line.style.top = line.y + "px";
    if (line.y > gameArea.offsetHeight) {
      line.y = -HEIGHT_ENEM;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll(".enemy");

  enemy.forEach(function (item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      // ДТП
      setting.start = false;
      audio.remove();
      start.classList.remove("hide");
      game.classList.remove("fon");
      game.classList.add("game_over");
      start.style.top = score.offsetHeight;
      addLocalStorage();
    }

    item.y += setting.speed / 2;
    item.style.top = item.y + "px";
    if (item.y >= gameArea.offsetHeight) {
      item.y = -HEIGHT_ENEM * setting.traffic;
      item.style.left =
        Math.floor(Math.random() * (gameArea.offsetWidth - HEIGHT_ENEM / 2)) +
        "px";
    }
  });
}

start.addEventListener("click", startGame);
document.addEventListener("keydown", startRun);
document.addEventListener("keyup", stopRun);
