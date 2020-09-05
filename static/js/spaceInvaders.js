const spaceInvadersContainer = document.getElementById("space-invaders-container");

let gameOver = false;
let lastRenderTime = 0;
const boardSize = 21;

const gameSpeed = 5;
let enemySpeed = 0;

const ship = [{ x: 11, y: 21 }];

//create array with 25 bullets
let bullet = new Array();
bullet = Array.apply(null, Array(25)).map(function () {
	return { x: 0, y: 0 };
});

let enemy = new Array();
enemy = Array.apply(null, Array(8)).map(function () {
	return { x: 0, y: 1 };
});

function gameloop(time) {
	if (gameOver===true) {
		document.getElementById("result").textContent = "You Lost";
		return;
	}
	window.requestAnimationFrame(gameloop);
	const secondsSinceLastRender = (time - lastRenderTime) / 1000;
	if (secondsSinceLastRender < 1 / gameSpeed) {
		return;
	}

	lastRenderTime = time; //change value to time for the loop to work
	spaceInvadersContainer.innerHTML = "";
	drawShip(spaceInvadersContainer);
	checkHit();
	if (enemySpeed === gameSpeed) {
		enemySpeed = 0;
		updateEnemy();
		enemyPositions();
	}
	drawEnemy(spaceInvadersContainer);
	updateBullet();
	drawBullet(spaceInvadersContainer);
	checkHit();
	enemySpeed += 1;
}

window.requestAnimationFrame(gameloop);

//movement system

let inputDirection = { x: 0, y: 0 };

window.addEventListener("keydown", (k) => {
	switch (k.key) {
		case "w":
			if (ship[0].y > 18) {
				inputDirection = { x: 0, y: -1 };
				updateShipPosition();
			}
			break;
		case "s":
			if (ship[0].y < boardSize) {
				inputDirection = { x: 0, y: 1 };
				updateShipPosition();
			}
			break;
		case "a":
			if (ship[0].x > 1) {
				inputDirection = { x: -1, y: 0 };
				updateShipPosition();
			}
			break;
		case "d":
			if (ship[0].x < boardSize) {
				inputDirection = { x: 1, y: 0 };
				updateShipPosition();
			}
			break;
		//shot
		case " ":
			bulletPositions();
			drawBullet(spaceInvadersContainer);
			break;
	}
});

//draw ship on board
function drawShip(spaceContainer) {
	ship.forEach((segment) => {
		const shipPosition = document.createElement("div");
		shipPosition.style.gridRowStart = segment.y;
		shipPosition.style.gridColumnStart = segment.x;
		shipPosition.classList.add("ship");
		spaceContainer.appendChild(shipPosition);
	});
}

function updateShipPosition() {
	//remove ship from grid
	var lastPostionShip = document.querySelector(".ship");
	lastPostionShip.remove();
	//set new position for ship
	ship[0].x += inputDirection.x;
	ship[0].y += inputDirection.y;
	inputDirection = { x: 0, y: 0 };
	drawShip(spaceInvadersContainer);
	drawBullet(spaceInvadersContainer);
}

function bulletPositions() {
	for (var i = 0; i < bullet.length; i++) {
		if (bullet[i].x === 0 && bullet[i].y === 0) {
			bullet[i].x = ship[0].x;
			bullet[i].y = ship[0].y - 1;
			break;
		}
	}
}

function updateBullet() {
	for (var i = 0; i < bullet.length; i++) {
		if (bullet[i].y !== 0) {
			bullet[i].y -= 1;
		} else if (bullet[i].y === 0) {
			bullet[i].y = 0;
			bullet[i].x = 0;
		}
	}
}

function drawBullet(spaceContainer) {
	bullet.forEach((segment) => {
		if (segment.x !== 0 && segment.y !== 0) {
			const bulletPosition = document.createElement("div");
			bulletPosition.style.gridRowStart = segment.y;
			bulletPosition.style.gridColumnStart = segment.x;
			bulletPosition.classList.add("bullet");
			spaceContainer.appendChild(bulletPosition);
		}
	});
}

function enemyPositions() {
	for (var i = 0; i < enemy.length; i++) {
		if (enemy[i].x === 0) {
			enemy[i].x = Math.floor(Math.random() * boardSize + 1);
		}
	}
}

function updateEnemy() {
	for (var i = 0; i < enemy.length; i++) {
		if (enemy[i].x !== 0) {
			if (enemy[i].y === 21) {
				gameOver = true;
			} else if (enemy[i].y < 23) enemy[i].y += 1;
		}
	}
}

function drawEnemy(spaceContainer) {
	enemy.forEach((segment) => {
		if (segment.x !== 0) {
			const enemyPosition = document.createElement("div");
			enemyPosition.style.gridRowStart = segment.y;
			enemyPosition.style.gridColumnStart = segment.x;
			enemyPosition.classList.add("square");
			spaceContainer.appendChild(enemyPosition);
		}
	});
}

function checkHit() {
	for (var i = 0; i < enemy.length; i++) {
		for (var b = 0; b < bullet.length; b++) {
			if (enemy[i].x === bullet[b].x && (enemy[i].y === bullet[b].y||enemy[i].y === bullet[b].y-1)) {
				enemy[i].x = 0;
				enemy[i].y = 1;
				bullet[b].y = 0;
				bullet[b].x = 0;
			}
		}
	}
}
