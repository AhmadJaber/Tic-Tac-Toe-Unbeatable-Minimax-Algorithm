//alert('connected');

// set variables

//this will be an array which will keep tracks there a x or y in each board
var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {

    // logic here is - if a square being clicked it can not be clicked no more
    if (typeof origBoard[square.target.id] == 'number') {

        //console.log(square.target.id);
        turn(square.target.id, huPlayer)

        // now give the turn to the ai to select it's best square
        if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);        
    }
}

function turn(squareId, player) {

    //show the player who took a turn
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;    

    //gamewon logic
    let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {

    //the logic here is , i use reduce method to find all the element(e) of the board, a is the accumolator,
    // whose initial value is [] when e === is player a will add with i or the index
    let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {
                index: index,
                player: player
            };
            break;
        }
    }

    return gameWon;
}

function gameOver(gameWon) {

    //logic here is go through every index of that wincombo the player selected
    for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}

    //remove the click event listener after gameover
    for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}

    //declare winner
    declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lose.");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

// the main minimax function
function minimax(newBoard, player) {

    //available spots
    var availSpots = emptySquares(newBoard);

    // checks for the terminal states such as win, lose, and tie 
    //and returning a value accordingly
    if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

    // an array to collect all the objects
    var moves = [];

    // aloop through available spots
    for (var i = 0; i < availSpots.length; i++) {

        //create an object for each and store the index of that spot
        var move = {};
		move.index = newBoard[availSpots[i]];

        // set the empty spot to the current player
        newBoard[availSpots[i]] = player;

        //collect the score resulted from calling minimax on the opponent of the current player
        if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

        // reset the spot to empty
        newBoard[availSpots[i]] = move.index;

        // push the object to the array
        moves.push(move);
    }

    // Evaluate best move
    // if it is the computer's turn loop over the moves and choose the move with the highest score
    var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}else {

        // else loop over the moves and choose the move with the lowest score
        var bestScore = 10000;
        for (var i=0; i<moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}