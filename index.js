const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");

// Responsive canvas setup
const unitSize = 25;
gameBoard.width = Math.floor(window.innerWidth / unitSize) * unitSize - unitSize;
gameBoard.height = Math.floor((window.innerHeight - 100) / unitSize) * unitSize - unitSize;

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = "white";
const snakeColor = "lightgreen";
const snakeBorder = "black";
const foodColor = "red";

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let highScore = 0;
let snake = [
    { x: unitSize * 4, y: 0 },
    { x: unitSize * 3, y: 0 },
    { x: unitSize * 2, y: 0 },
    { x: unitSize, y: 0 },
    { x: 0, y: 0 }
];

window.addEventListener("keydown", handleKeyPress);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running = true;
    score = 0;
    updateScore();
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function createFood() {
    function randomFood(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }

    do {
        foodX = randomFood(0, gameWidth - unitSize);
        foodY = randomFood(0, gameHeight - unitSize);
    } while (snake.some(part => part.x === foodX && part.y === foodY));
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
}

function moveSnake() {
    const head = {
        x: snake[0].x + xVelocity,
        y: snake[0].y + yVelocity
    };
    snake.unshift(head);

    if (head.x === foodX && head.y === foodY) {
        score++;
        if (score > highScore) highScore = score;
        updateScore();
        createFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(part => {
        ctx.fillRect(part.x, part.y, unitSize, unitSize);
        ctx.strokeRect(part.x, part.y, unitSize, unitSize);
    });
}

function handleKeyPress(event) {
    const key = event.key;

    const goingUp = yVelocity === -unitSize;
    const goingDown = yVelocity === unitSize;
    const goingLeft = xVelocity === -unitSize;
    const goingRight = xVelocity === unitSize;

    if (!running && key === " ") {
        resetGame(); // Restart on Spacebar
        return;
    }

    switch (key) {
        case "ArrowLeft":
            if (!goingRight) {
                xVelocity = -unitSize;
                yVelocity = 0;
            }
            break;
        case "ArrowUp":
            if (!goingDown) {
                xVelocity = 0;
                yVelocity = -unitSize;
            }
            break;
        case "ArrowRight":
            if (!goingLeft) {
                xVelocity = unitSize;
                yVelocity = 0;
            }
            break;
        case "ArrowDown":
            if (!goingUp) {
                xVelocity = 0;
                yVelocity = unitSize;
            }
            break;
    }
}

function checkGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight) {
        running = false;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            running = false;
        }
    }
}

function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
}

function resetGame() {
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 }
    ];
    gameStart();
}

function updateScore() {
    scoreText.textContent = `Score: ${score} | High Score: ${highScore}`;
}