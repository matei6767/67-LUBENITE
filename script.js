const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');
const restartButton = document.getElementById('restartButton');

const game = {
  width: canvas.width,
  height: canvas.height,
  running: true,
  crashed: false,
  score: 0,
};

const player = {
  x: 120,
  y: 200,
  width: 80,
  height: 48,
  speed: 5,
  color: '#4da6ff',
  dx: 0,
  dy: 0,
};

const enemy = {
  x: 620,
  y: 200,
  width: 80,
  height: 48,
  speed: 3,
  color: '#ff6b6b',
  direction: 1,
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
};

function resetGame() {
  player.x = 120;
  player.y = 200;
  player.dx = 0;
  player.dy = 0;
  enemy.x = 620;
  enemy.y = 200;
  enemy.direction = 1;
  game.running = true;
  game.crashed = false;
  game.score = 0;
  statusEl.textContent = 'Status: În curs';
}

function drawCar(car) {
  ctx.fillStyle = car.color;
  ctx.fillRect(car.x, car.y, car.width, car.height);
  ctx.fillStyle = '#1a2131';
  ctx.fillRect(car.x + 14, car.y + 8, 12, 32);
  ctx.fillRect(car.x + car.width - 26, car.y + 8, 12, 32);
  ctx.fillStyle = '#cbd5ff';
  ctx.fillRect(car.x + 18, car.y + 4, car.width - 36, 8);
}

function drawRoad() {
  ctx.fillStyle = '#101225';
  ctx.fillRect(0, 0, game.width, game.height);
  ctx.fillStyle = '#2f3555';
  ctx.fillRect(80, 0, game.width - 160, game.height);
  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 4;
  ctx.setLineDash([18, 18]);
  ctx.beginPath();
  ctx.moveTo(game.width / 2, 0);
  ctx.lineTo(game.width / 2, game.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function animateRoad() {
  const laneLineWidth = 6;
  const laneLineHeight = 30;
  const gap = 40;
  const offset = (performance.now() / 10) % (laneLineHeight + gap);
  ctx.fillStyle = '#d1d5db';
  for (let y = -gap + offset; y < game.height; y += laneLineHeight + gap) {
    ctx.fillRect(game.width / 2 - laneLineWidth / 2, y, laneLineWidth, laneLineHeight);
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function update() {
  if (!game.running) return;

  player.dx = 0;
  player.dy = 0;
  if (keys.ArrowUp) player.dy = -player.speed;
  if (keys.ArrowDown) player.dy = player.speed;
  if (keys.ArrowLeft) player.dx = -player.speed;
  if (keys.ArrowRight) player.dx = player.speed;

  player.x += player.dx;
  player.y += player.dy;
  player.x = clamp(player.x, 90, game.width - player.width - 90);
  player.y = clamp(player.y, 0, game.height - player.height);

  enemy.y += enemy.speed * enemy.direction;
  if (enemy.y <= 0 || enemy.y + enemy.height >= game.height) {
    enemy.direction *= -1;
  }

  game.score += 1;

  if (isCollision(player, enemy)) {
    game.running = false;
    game.crashed = true;
    statusEl.textContent = 'Status: ACCIDENT! Apasă Restart.';
  }
}

function isCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function draw() {
  drawRoad();
  animateRoad();
  drawCar(player);
  drawCar(enemy);

  if (game.crashed) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, 0, game.width, game.height);
    ctx.fillStyle = '#ffccd5';
    ctx.font = 'bold 42px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ACCIDENT!', game.width / 2, game.height / 2 - 20);
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText('Apasă Restart pentru a juca din nou', game.width / 2, game.height / 2 + 30);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
  }
});

restartButton.addEventListener('click', resetGame);
resetGame();
requestAnimationFrame(gameLoop);
