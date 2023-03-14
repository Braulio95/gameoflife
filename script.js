
// Set global variables
let rows = 50;
let cols = 50;
let lado = 10;

// Take a "picture" of the previous state
let pic = [];


let genBoard = () => {
	let html = "<table cellpadding=0 cellspacing=0 id='board'>";
	for (let y = 0; y < rows; y++) {
		html += "<tr>";
		for (let x = 0; x < cols; x++) {
			html += `<td id="cell-${x + "-" + y}" onmouseup="changeState(${x}, ${y});complexity = []">`;
			html += "</td>";
		}
		html += "</tr>";
	}
	html += "</table>";
	let contenedor = document.getElementById("boardContainer");
	contenedor.innerHTML = html;
	let board = document.getElementById("board");
	board.style.width = lado * cols + "px";
	board.style.height = lado * rows + "px";
}

let changeState = (x, y) => {
	let cell = document.getElementById(`cell-${x + "-" + y}`);
	if (cell.style.background != "black") {
		cell.style.background = "black";
	} else {
		cell.style.background = "";
	}
}



genBoard();
