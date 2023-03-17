
// Set global variables
let rows = 50;
let cols = 50;
let lado = 10;


// Initial play state on false
let play = false;

// Take a "picture" of the previous state
let pic = [];

let complexity = [];
let p_complexity = [];
let verifyValues = [];

//Setting variables for the score
let level = 0;
let scoreboard = document.getElementById("score");

// Function to play and pause
let playGame = () => {
	complexity = [];
	play = !play;
	// If var play is true we change the state to pause, and play game
	if (play) {
		document.getElementById("btn1").innerHTML = 'Pause';
	}
	else {
		// If we pause the game we change state of button to Play
		document.getElementById("btn1").innerHTML = 'Play';
	}
}

// Generate board and grid
let genBoard = () => {
	// Assign a table tag to a variable
	let html = "<table cellpadding=0 cellspacing=0 id='board'>";
	// Go thru rows and cols to create cells
	for (let y = 0; y < rows; y++) {
		html += "<tr>";
		for (let x = 0; x < cols; x++) {
			// Accumulate td tags with different ID to create the grid
			html += `<td id="cell-${x + "-" + y}" onmouseup="changeState(${x}, ${y});complexity = []">`;
			html += "</td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	// Obtenain the div-board element and send the td tags
	let contenedor = document.getElementById("boardContainer");
	contenedor.innerHTML = html;

	// Change style to create lines between rows and cols
	let board = document.getElementById("board");
	board.style.width = lado * cols + "px";
	board.style.height = lado * rows + "px";
}

// Receive parameters from the cell creation
let changeState = (x, y) => {
	// Obtain id from the selected cell
	let cell = document.getElementById(`cell-${x + "-" + y}`);
	// Change to black if cell is white (dead)
	if (cell.style.background != "rgb(6, 44, 67)") {
		cell.style.background = "rgb(6, 44, 67)";
	} 
	else {
		cell.style.background = ""; // Stays dead
	}
}
//ading function that generates a random pattern
let random = () => {
	if(!play){
		for (let x = 0; x < cols; x++) { //nested fors iterate through all the rows and columns of the grid
			for (let y = 0; y < rows; y++) {
				if (Math.random() < 0.2) { //if this random condition is true then state of each individual cell will change
					changeState(x, y);
				}
			}
		}
	}
}

// Calcutate complexity of where is the cell
let calcComplexity = (x, y) => {
	if (pic[x][y]) {
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (!complexity[x + i]) {
					complexity[x + i] = [];
				}
				complexity[x + i][y + j] = true;
			}
		}
	}
}

// To change in the nex gen we need to take a "picture" or frame of the current state
let firstFrame = () => {
	for (let x = 0; x < cols; x++) {
		pic.push([]);
		verifyValues.push([]);
		for (let y = 0; y < rows; y++) {
			let cell = document.getElementById(`cell-${x + "-" + y}`);
			// Clone the current state
			pic[x][y] = cell.style.background == "rgb(6, 44, 67)";
			calcComplexity(x, y);
		}
	}
}

// Clear the board
let clean = () => {
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			// Get the div cell id
			let cell = document.getElementById(`cell-${x + "-" + y}`);
			// Change to dead-white
			cell.style.background = "";
		}
	}
}

// Clear the board
let reset = () => {
	complexity = [];
	level = 0;
	scoreboard.innerText = "Generation: " + level;
	for (let x = 0; x < cols; x++) {
		for (let y = 0; y < rows; y++) {
			// Get the div cell id
			let cell = document.getElementById(`cell-${x + "-" + y}`);
			// Change to dead-white
			cell.style.background = "";
		}
	}
}

// Count alive cells
let countAlive = (x, y) => {
	let alive = 0;
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			if (i == 0 && j == 0) {
				continue;
			}
			try {
				if (pic[x + i][y + j]) {
					alive++;
				}
			} catch (e) { }
			// We return on this condicition because the rule of overpopulation
			if (alive > 3) {
				return alive;
			}
		}
	}
	return alive;
}

let otherPics = () => {
	for (let x in p_complexity) {
		for (let y in p_complexity[x]) {
			try {
				// Get cell position
				let cell = document.getElementById(`cell-${x + "-" + y}`);
				if (!pic[x]) {
					pic[x] = [];
					verifyValues[x] = [];
				}
				// Cell is alive
				pic[x][y] = cell.style.background == "rgb(6, 44, 67)";
				calcComplexity(Number(x), Number(y));
			} catch (e) { }
		}
	}
	p_complexity = [];
}

let frame = () => {
	p_complexity = JSON.parse(JSON.stringify(complexity));
	complexity = [];
	verifyValues = [];
	pic = [];
	if (!p_complexity.length) {
		firstFrame();
	} else {
		otherPics();
	}
}

// Next generation of cells
let nextState = () => {
	frame();
	level += 1;
	scoreboard.innerText = "Generation: " + level;
	for (const x in complexity) {
		for (const y in complexity[x]) {
			try {
				if (verifyValues[x][y]) {
					continue;
				}
				verifyValues[x][y] = true;

				let alive = countAlive(Number(x), Number(y));
				let cell = document.getElementById(`cell-${x + "-" + y}`);
				// Apply the rules of the game of life
				// Here we evaluate if dies due to loneliness or over population
				if (pic[x][y]) {
					if (alive < 2 || alive > 3) {
						cell.style.background = "";
					}
				} 
				else {
					// We evaluate if cell can born, pnly if have 3 neighbors
					if (alive == 3){
						cell.style.background = "rgb(6, 44, 67)"
					}
				}
			} catch (e) { }
		}
	}
}

// Interval to animation, 0.3 second each generation
setInterval(() => {
	if (play) {
		nextState();
	}
}, 300);


genBoard();
