document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const paddle = document.getElementById('paddle');
    const gameContainer = document.getElementById('game-container');
    const livesSpan = document.getElementById('lives');
    const scoreSpan = document.getElementById('score');
    const restartBtn = document.getElementById('restart-btn');
  
    let ballX = 200;
    let ballY = 150;
    let ballSpeedX = 2;
    let ballSpeedY = 2;
  
    let paddleWidth = 80; // Adjust paddle width
    let paddleX = 160;
    const paddleSpeed = 10;
  
    let lives = 3;
    let score = 0;
    let gameStarted = false;
  
    // Create multiple bricks with a visible gap
    const gap = 10; // Adjust the gap between bricks
    const brickWidth = 50;
    const brickHeight = 20;
  
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        if (!(i === 1 && j === 3)) {
          const brick = document.createElement('div');
          brick.classList.add('brick');
          brick.style.left = `${j * (brickWidth + gap)}px`;
          brick.style.top = `${i * (brickHeight + gap)}px`;
          gameContainer.appendChild(brick);
        }
      }
    }
  
    const bricks = document.querySelectorAll('.brick');
  
    function updateGame() {
      if (!gameStarted) {
        requestAnimationFrame(updateGame);
        return;
      }
  
      ballX += ballSpeedX;
      ballY += ballSpeedY;
  
      // Check for collisions with walls
      if (ballX < 0 || ballX > gameContainer.clientWidth - ball.clientWidth) {
        ballSpeedX = -ballSpeedX;
      }
  
      if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
      }
  
      // Check for collisions with the paddle
      if (
        ballX + ball.clientWidth > paddleX &&
        ballX < paddleX + paddleWidth &&
        ballY + ball.clientHeight > gameContainer.clientHeight - paddle.clientHeight
      ) {
        ballSpeedY = -ballSpeedY;
      }
  
      // Check for collisions with bricks
      bricks.forEach((brick) => {
        if (
          brick.style.display !== 'none' &&
          ballX + ball.clientWidth > brick.offsetLeft &&
          ballX < brick.offsetLeft + brick.clientWidth &&
          ballY + ball.clientHeight > brick.offsetTop &&
          ballY < brick.offsetTop + brick.clientHeight
        ) {
          ballSpeedY = -ballSpeedY;
          brick.style.display = 'none';
          score += 10;
  
          if (score === bricks.length * 10) {
            alert('Congratulations! You won!');
            resetGame();
          }
        }
      });
  
      // Check for collisions with the bottom wall (player loses a life)
      if (ballY > gameContainer.clientHeight - ball.clientHeight) {
        lives--;
  
        if (lives === 0) {
          alert('Game Over! You ran out of lives.');
          resetGame();
        } else {
          resetBallAndPaddle();
        }
      }
  
      // Update the game elements
      ball.style.left = `${ballX}px`;
      ball.style.top = `${ballY}px`;
      paddle.style.left = `${paddleX}px`;
  
      // Update the UI
      livesSpan.textContent = lives;
      scoreSpan.textContent = score;
  
      requestAnimationFrame(updateGame);
    }
  
    function resetBallAndPaddle() {
      ballX = 200;
      ballY = 150;
      ballSpeedX = 2;
      ballSpeedY = 2;
      paddleX = 160;
    }
  
    function resetGame() {
      resetBallAndPaddle();
      lives = 3;
      score = 0;
  
      bricks.forEach((brick) => {
        brick.style.display = 'block';
      });
  
      gameStarted = false;
    }
  
    document.addEventListener('mousemove', (e) => {
      if (gameStarted) {
        // Update paddle position based on mouse movement
        paddleX = e.clientX - gameContainer.getBoundingClientRect().left - paddleWidth / 2;
        // Ensure the paddle stays within the game container
        if (paddleX < 0) {
          paddleX = 0;
        } else if (paddleX > gameContainer.clientWidth - paddleWidth) {
          paddleX = gameContainer.clientWidth - paddleWidth;
        }
      }
    });
  
    gameContainer.addEventListener('click', () => {
      if (!gameStarted) {
        gameStarted = true;
      }
    });
  
    restartBtn.addEventListener('click', () => {
      resetGame();
    });
  
    resetGame();
    updateGame();
  });
  