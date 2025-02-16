const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 4,
    dy: 4,
    color: '#0095DD'
};

let shape = {
    type: 'circle',
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 290,
    size: 580,
    color: '#000'
};

let bounceCount = 0;
let level = 1;
let musicMode = false;
let audio = new Audio();
let gamePaused = false;

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    ball.x = e.clientX - rect.left;
    ball.y = e.clientY - rect.top;
    ball.dx = (Math.random() - 0.5) * 10;
    ball.dy = (Math.random() - 0.5) * 10;
});

document.getElementById('toggleMusicBtn').addEventListener('click', toggleMusic);
document.getElementById('startGameBtn').addEventListener('click', startGame);
document.getElementById('pauseGameBtn').addEventListener('click', pauseGame);
document.getElementById('resetGameBtn').addEventListener('click', resetGame);
document.getElementById('shapeSelect').addEventListener('change', changeShape);

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawShape() {
    ctx.beginPath();
    switch (shape.type) {
        case 'circle':
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            break;
        case 'square':
            ctx.rect(shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
            break;
        case 'triangle':
            ctx.moveTo(shape.x, shape.y - shape.size / 2);
            ctx.lineTo(shape.x - shape.size / 2, shape.y + shape.size / 2);
            ctx.lineTo(shape.x + shape.size / 2, shape.y + shape.size / 2);
            ctx.closePath();
            break;
    }
    ctx.strokeStyle = shape.color;
    ctx.stroke();
}

function update() {
    if (gamePaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawShape();
    drawBall();

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (shape.type === 'circle') {
        if (Math.hypot(ball.x - shape.x, ball.y - shape.y) + ball.radius > shape.radius) {
            bounceBall();
        }
    } else if (shape.type === 'square') {
        if (ball.x - ball.radius < shape.x - shape.size / 2 ||
            ball.x + ball.radius > shape.x + shape.size / 2 ||
            ball.y - ball.radius < shape.y - shape.size / 2 ||
            ball.y + ball.radius > shape.y + shape.size / 2) {
            bounceBall();
        }
    } else if (shape.type === 'triangle') {
        // Implement triangle collision detection
    }

    if (shape.radius <= ball.radius || shape.size <= ball.radius * 2) {
        levelUp();
    }

    requestAnimationFrame(update);
}

function bounceBall() {
    ball.dx = -ball.dx;
    ball.dy = -ball.dy;
    bounceCount++;
    document.getElementById('bounceCount').innerText = bounceCount;
    if (shape.type === 'circle') {
        shape.radius -= 5;
    } else if (shape.type === 'square' || shape.type === 'triangle') {
        shape.size -= 10;
    }
    if (musicMode) {
        audio.play();
    }
}

function levelUp() {
    alert('Level Up! Total bounces: ' + bounceCount);
    level++;
    document.getElementById('level').innerText = level;
    shape.radius = 290 - (level - 1) * 20;
    shape.size = 580 - (level - 1) * 40;
    ball.dx = (Math.random() - 0.5) * 10;
    ball.dy = (Math.random() - 0.5) * 10;
}

function toggleMusic() {
    musicMode = !musicMode;
    if (musicMode) {
        const songUrl = document.getElementById('songUrl').value;
        if (songUrl) {
            audio.src = songUrl;
            audio.load();
        } else {
            musicMode = false;
            alert('Please enter a valid song URL.');
        }
    }
}

function startGame() {
    gamePaused = false;
    update();
}

function pauseGame() {
    gamePaused = true;
}

function resetGame() {
    document.location.reload();
}

function changeShape() {
    shape.type = document.getElementById('shapeSelect').value;
    shape.radius = 290;
    shape.size = 580;
    bounceCount = 0;
    level = 1;
    document.getElementById('bounceCount').innerText = bounceCount;
    document.getElementById('level').innerText = level;
    resetGame();
}

update();
