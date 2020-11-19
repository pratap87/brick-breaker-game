 function checkWindowWidth() {

     const orientation = window.innerWidth <= 480 ? 'portrait' : 'landscape';

     if (orientation == 'portrait') {
         document.getElementById('js-flip-overlay').style.display = 'block';
     } else {
         document.getElementById('js-flip-overlay').style.display = 'none';
     }

 }

 function reset() {
     document.location.reload();
 }

 let score = 0;
 let lives = 3;

 const canvas = document.getElementById('js-canvas-breakout');
 const ctx = canvas.getContext('2d');

 const ballRadius = 10;

 let ballX = canvas.width / 2;
 let ballY = canvas.height - 30;

 const speed = 2;
 let directionX = speed;
 let directionY = -speed;

 const paddleHeight = 10;
 const paddleWidth = 75;

 let paddleX = (canvas.width - paddleWidth) / 2;

 let rightPressed = false;
 let leftPressed = false;

 const brickRowCount = 3;
 const brickColumnCount = 5;
 const brickWidth = 75;
 const brickHeight = 20;
 const brickPadding = 10;
 const brickOffsetTop = 30;
 const brickOffsetLeft = 30;

 let bricks = [];



 // Setting bricks as 2d array containing an object with X and Y coords and brick status (show or not)
 for (let c = 0; c < brickColumnCount; c++) {
     bricks[c] = [];
     for (let r = 0; r < brickRowCount; r++) {
         bricks[c][r] = { x: 0, y: 0, status: 1 };
     }
 }

 // Listen for key presses and mouse movement
 document.addEventListener('keydown', keyDownHandler, false);
 document.addEventListener('keyup', keyUpHandler, false);
 document.addEventListener('mousemove', mouseMoveHandler, false);

 // Touch events for mobile
 document.addEventListener('touchstart', touchHandler, false);
 document.addEventListener('touchmove', touchMoveHandler, false);
 document.addEventListener('touchend', touchHandler, false);

 function keyDownHandler(e) {

     if (e.key == 'Right' || e.key == 'ArrowRight') {
         rightPressed = true;
     } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
         leftPressed = true;
     }

 }

 function keyUpHandler(e) {

     if (e.key == 'Right' || e.key == 'ArrowRight') {
         rightPressed = false;
     } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
         leftPressed = false;
     }

 }

 function mouseMoveHandler(e) {

     const relativeX = e.clientX - canvas.offsetLeft; // Where is the mouse X position in the viewport 

     // Check that cursor is on the canvas
     if (relativeX > 0 && relativeX < canvas.width) {
         paddleX = relativeX - paddleWidth / 2; // Half of paddle width so that movement is relative to the middle of the paddle
     }

 }

 function touchHandler(e) {

     const relativeX = e.changedTouches[0].pageX - canvas.offsetLeft; // Where is the mouse X position in the viewport 

     // Check that cursor is on the canvas
     if (relativeX > 0 && relativeX < canvas.width) {
         paddleX = relativeX - paddleWidth / 2; // Half of paddle width so that movement is relative to the middle of the paddle
     }

 }

 function touchMoveHandler(e) {

     const relativeX = e.targetTouches[0].pageX - canvas.offsetLeft; // Where is the mouse X position in the viewport 

     // Check that cursor is on the canvas
     if (relativeX > 0 && relativeX < canvas.width) {
         paddleX = relativeX - paddleWidth / 2; // Half of paddle width so that movement is relative to the middle of the paddle
     }

 }

 // Drawing the ball
 function drawBall() {

     ctx.beginPath();
     ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
     ctx.fillStyle = '#13a7cc';
     ctx.fill();
     ctx.closePath();

 }

 function drawPaddle() {

     ctx.beginPath();
     ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
     ctx.fillStyle = '#0b7c98';
     ctx.fill();
     ctx.closePath();

 }

 function drawBricks() {

     let brickX, brickY;

     let gradientBg = ctx.createLinearGradient(0, 0, 170, 0);
     gradientBg.addColorStop(0, '#ad2121');
     gradientBg.addColorStop(1, '#6c1616');

     for (let c = 0; c < brickColumnCount; c++) {
         for (let r = 0; r < brickRowCount; r++) {

             // Check brick status to see if it must be drawn
             if (bricks[c][r].status == 1) {

                 // Working out XY position of each brick
                 brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                 brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;

                 bricks[c][r].x = brickX;
                 bricks[c][r].y = brickY;

                 ctx.beginPath();
                 ctx.rect(brickX, brickY, brickWidth, brickHeight);
                 ctx.fillStyle = gradientBg;
                 ctx.fill();
                 ctx.closePath();

             }

         }
     }

 }

 function drawScore() {

     ctx.font = '16px Courier, monospace';
     ctx.fillStyle = '#ffffff';
     ctx.fillText('Score: ' + score, 8, 20);

 }

 function drawLives() {

     ctx.font = '16px Courier, monospace';
     ctx.fillStyle = '#ffffff';
     ctx.fillText('Lives: ' + lives, canvas.width - 85, 20);

 }

 function brickCollisionDetection() {

     let brickObject; // current brick object

     for (let c = 0; c < brickColumnCount; c++) {
         for (let r = 0; r < brickRowCount; r++) {

             brickObject = bricks[c][r];

             // Check brick status
             if (brickObject.status == 1) {

                 // Collision calculations
                 if (ballX > brickObject.x && ballX < (brickObject.x + brickWidth) && ballY > brickObject.y && ballY < (brickObject.y + brickHeight)) {

                     directionY = -directionY; // change ball direction
                     brickObject.status = 0; // Set brick status to 0 so it 'breaks'
                     score++; // Increment overall score each time a brick is 'broken'

                     // WIN LOGIC: If score is equal to total number of bricks
                     if (score == brickRowCount * brickColumnCount) {

                         // SUCCESS! Winner!
                         document.getElementById('js-popup-success').style.display = 'block';
                         togglePause();

                     }

                 }

             }

         }
     }

 }

 function draw() {

     // Clear canvas before drawing
     ctx.clearRect(0, 0, canvas.width, canvas.height);

     // Set background image on canvas 
     var img = document.getElementById('js-bg-image');
     ctx.drawImage(img, (canvas.width / 2) - (img.width / 2), (canvas.height / 2) - (img.height / 2));

     drawBall();
     drawPaddle();
     drawBricks();
     drawScore();
     drawLives();

     brickCollisionDetection();

     // BALL COLLISION X AXIS:
     // If the ball's X position is more than the width of the canvas (canvas.width = right boundry) then change direction 
     // OR
     // If the ball's X position is less than than 0 (0 = left boundry) then change direction
     if ((ballX + directionX > canvas.width - ballRadius) || (ballX + directionX < ballRadius)) { // To set collision from the ball edge and not the center, user the ball radius
         directionX = -directionX; // reversing the movement
     }

     // BALL COLLISION Y AXIS:
     // If the ball's Y position is more than the height of the canvas (canvas.height = bottom) then change direction 
     if (ballY + directionY < ballRadius) {
         directionY = -directionY; // reversing the movement
     }
     // ELSE if the ball's Y position is less than than 0 (0 = top)...
     else if (ballY + directionY > canvas.height - ballRadius) {

         // First check if the ball has collided with the paddle (the ball is between the left and right edges of the paddle)
         if (ballX > paddleX && ballX < paddleX + paddleWidth) {
             directionY = -directionY;
         }
         // GAME OVER LOGIC - if the ball collides with the bottom boundry
         else {

             // Decrease lives by 1
             lives--;

             if (lives == 0) {

                 // LOSE LOGIC
                 document.getElementById('js-popup-fail').style.display = 'block';
                 togglePause();

             } else {
                 // Reset ball and paddle
                 ballX = canvas.width / 2;
                 ballY = canvas.height - 30;
                 directionX = speed;
                 directionY = -speed;
                 paddleX = (canvas.width - paddleWidth) / 2;
             }

         }

     }

     // PADDLE MOVEMENT: 
     // Right button is pressed AND paddle position is not greater than right boundry
     if (rightPressed && paddleX < canvas.width - paddleWidth) {
         paddleX += 7;
     }
     // Left button is pressed AND paddle position is not less than left boundry
     else if (leftPressed && paddleX > 0) {
         paddleX -= 7;
     }

     ballX += directionX;
     ballY += directionY;

     requestAnimationFrame(draw); // Better rendering of animations

 }

 checkWindowWidth();
 draw();