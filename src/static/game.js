const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 320;
canvas.height = 480;

// Bird properties
let bird = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    gravity: 0.6,
    lift: -15,
    velocity: 0,
};

// Game variables
let pipes = [];
let pipeGap = 100;
let pipeWidth = 40;
let frameCount = 0;
let score = 0;
let gameOver = false;
let pipeSpeed = 2;

// Load bird image
let birdImage = new Image();
birdImage.src = 'https://raw.githubusercontent.com/sourabhv/FlapPyBird/master/assets/sprites/yellowbird-midflap.png';

// Handle space bar and click to control bird
document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        bird.velocity = bird.lift;
    }
});

canvas.addEventListener('click', function () {
    bird.velocity = bird.lift;
});

// Pipe object
class Pipe {
    constructor() {
        this.top = Math.random() * (canvas.height / 2);
        this.bottom = canvas.height - (this.top + pipeGap);
        this.x = canvas.width;
        this.width = pipeWidth;
        this.speed = pipeSpeed;
    }

    update() {
        this.x -= this.speed;

        // If pipe goes off screen, remove it
        if (this.x + this.width < 0) {
            pipes.shift();
            score++;
        }
    }

    draw() {
        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(this.x, 0, this.width, this.top); // Top pipe
        ctx.fillRect(this.x, canvas.height - this.bottom, this.width, this.bottom); // Bottom pipe
    }

    // Collision detection
    hits(bird) {
        if (
            bird.y < this.top ||
            bird.y + bird.height > canvas.height - this.bottom
        ) {
            if (bird.x + bird.width > this.x && bird.x < this.x + this.width) {
                return true;
            }
        }
        return false;
    }
}

function drawBird() {
    ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent bird from falling off the canvas
    if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        gameOver = true;
    }

    // Prevent bird from going above the canvas
    if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
    }
}

function updatePipes() {
    if (frameCount % 90 === 0) {
        pipes.push(new Pipe());
    }

    pipes.forEach((pipe) => {
        pipe.update();
        pipe.draw();

        if (pipe.hits(bird)) {
            gameOver = true;
        }
    });
}

function displayScore() {
    document.getElementById('score').innerText = 'Score: ' + score;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updateBird();
        updatePipes();
        drawBird();
        displayScore();

        frameCount++;
        requestAnimationFrame(gameLoop);
    } else {
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 70, canvas.height / 2);
    }
}

// Game settings
document.getElementById('start-game').addEventListener('click', function() {
    // Get settings values
    bird.gravity = parseFloat(document.getElementById('gravity').value);
    pipeSpeed = parseFloat(document.getElementById('pipe-speed').value);
    pipeGap = parseFloat(document.getElementById('pipe-gap').value);

    // Hide the start button
    document.getElementById('start-button-container').classList.add('hidden');

    // Reset game variables
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    gameOver = false;

    // Start the game loop
    gameLoop();
});
