const snakeContainer = document.getElementById("snake-container");
let gameOver = false;

let lastRenderTime = 0;
//board size same as in style.css grid-template-rows and grid-template-columns
const boardSize = 16;
//snake settings
const expansionSnake = 1;
const snakeBody = [{ x: 11, y: 11 }];
const snakeSpeed = 6;
let newSegments = 0;

//game loop
function main(time) {
	if (gameOver) {
		document.getElementById("result").textContent = "You Lost";
		return;
	}

	window.requestAnimationFrame(main);
  const secondsSinceLastRender = (time - lastRenderTime) / 1000;
  //the loop which the snake moves, the higher the speed, the faster the snake moves
	if (secondsSinceLastRender < 1 / snakeSpeed) {
		return;
	}
  
	lastRenderTime = time;//change value to time for the loop to work
	update(); //update position snake and food
	draw(); //draw on board snake and food
}

//start game loop
window.requestAnimationFrame(main);

function update() {
	updateSnake();
	updateFood();
	checkDeath();
}

function draw() {
	snakeContainer.innerHTML = "";
	drawSnake(snakeContainer);
	drawFood(snakeContainer);
}

function checkDeath() {
	gameOver = outsideGrid(getSnakeHead()) || snakeIntersection();
}

function randomGridPosition() {
	return {
		x: Math.floor(Math.random() * boardSize) + 1,
		y: Math.floor(Math.random() * boardSize) + 1,
	};
}

function outsideGrid(position) {
	return position.x < 1 || position.x > boardSize || position.y < 1 || position.y > boardSize;
}

let food = getRandomFoodPosition();

function updateFood() {
	if (onSnake(food)) {
		expandSnake(expansionSnake);
		food = getRandomFoodPosition();
	}
}

function drawFood(snakeContainer) {
	const foodElement = document.createElement("div");
	foodElement.style.gridRowStart = food.y;
	foodElement.style.gridColumnStart = food.x;
	foodElement.classList.add("apple");
	snakeContainer.appendChild(foodElement);
}

function getRandomFoodPosition() {
	let newFoodPosition;
	while (newFoodPosition == null || onSnake(newFoodPosition)) {
		newFoodPosition = randomGridPosition();
	}
	return newFoodPosition;
}

let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };


// movement system
window.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "w":
			if (lastInputDirection.y !== 0) break;
			inputDirection = { x: 0, y: -1 };
			break;
		case "s":
			if (lastInputDirection.y !== 0) break;
			inputDirection = { x: 0, y: 1 };
			break;
		case "a":
			if (lastInputDirection.x !== 0) break;
			inputDirection = { x: -1, y: 0 };
			break;
		case "d":
			if (lastInputDirection.x !== 0) break;
			inputDirection = { x: 1, y: 0 };
			break;
	}
});

function getInputDirection() {
	lastInputDirection = inputDirection;
	return inputDirection;
}

function updateSnake() {
	addSegments();

	const inputDirection = getInputDirection();
	for (let i = snakeBody.length - 2; i >= 0; i--) {
		snakeBody[i + 1] = { ...snakeBody[i] };
	}

	snakeBody[0].x += inputDirection.x;
	snakeBody[0].y += inputDirection.y;
}

function drawSnake(snakeContainer) {
	snakeBody.forEach((segment) => {
		const snakeElement = document.createElement("div");
		snakeElement.style.gridRowStart = segment.y;
		snakeElement.style.gridColumnStart = segment.x;
		snakeElement.classList.add("snake");
		snakeContainer.appendChild(snakeElement);
	});
}

function expandSnake(amount) {
	newSegments += amount;
}

function onSnake(position, { ignoreHead = false } = {}) {
	return snakeBody.some((segment, index) => {
		if (ignoreHead && index === 0) return false;
		return equalPositions(segment, position);
	});
}

function getSnakeHead() {
	return snakeBody[0];
}

function snakeIntersection() {
	return onSnake(snakeBody[0], { ignoreHead: true });
}

function equalPositions(pos1, pos2) {
	return pos1.x === pos2.x && pos1.y === pos2.y;
}

function addSegments() {
	for (let i = 0; i < newSegments; i++) {
		snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
	}

	newSegments = 0;
}
