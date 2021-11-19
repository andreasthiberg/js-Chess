import { constructBoard, constructBoardArray } from './modules/constructBoard.js';
import { placePieces, clearBoard, promotePawn } from './modules/updateBoard.js';
import { attemptMovement, checkForCheck, checkIfDiagonal, checkForMate } from './modules/movements.js';
import { compareCoords, copyBoard, minutesAndSeconds, findPieceIndex, capturedPiecesDisplay } from './modules/helperFunctions.js';

/* Array for storing the board state */
let boardArray = [];

/* Game variables */
let currentTurn = "W";
let pieceSelectedBool = false;
let selectedSquareId = "";
let promotionCoords;

const capturedWhitePieces = [];
const capturedBlackPieces = [];
const resultIndicator = document.getElementsByClassName("result-indicator")[0];

/* Timer variables */
let chosenTime = 0;
let timeRemainingBlack;
let timeRemainingWhite;
let timerInterval;
let gameStarted = false;

(function () {
    /* Construct chessboard and add eventlisteners to squares.
    Squares have IDs of 00 to 77, corresponding to A1 to H8 */
    constructBoard();
    const squares = document.querySelectorAll(".white-square,.black-square");
    for (let i = 0; i < squares.length; i++) {
        squares[i].addEventListener("click", squareClick);
    }

    /* Initializes promotion (pawn reaches end square) option picker */
    promotionInitialize();

    /* Construct chessboard array. [0][0] is square A1, [1,0] is B1, etc. [7,7] is square H8 */
    boardArray = constructBoardArray();

    /* Place the visual pieces according to array */
    placePieces(boardArray);

    /* Add timer button */
    initializeTimer();
})();


/* TIMER AND GAME STARTING FUNCTIONS */

/*Create listeners for timer functions */
function initializeTimer () {
    const options = document.getElementsByClassName("timer-option");
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener("click", selectTimerOption);
    }
    document.getElementsByClassName("timer-button")[0].addEventListener("click", startGame);
}

/*Changes the time setting */
function selectTimerOption (event) {
    const buttonClasses = event.currentTarget.classList;
    if (buttonClasses.contains("three-minutes")) {
        chosenTime = 3;
    } else if (buttonClasses.contains("five-minutes")) {
        chosenTime = 5;
    } else if (buttonClasses.contains("ten-minutes")) {
        chosenTime = 10;
    } else if (buttonClasses.contains("no-limit")) {
        chosenTime = 0;
    }
    const options = document.getElementsByClassName("timer-option");
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove("selected-timer-option");
    }
    event.currentTarget.classList.add("selected-timer-option");
}

/* Starts a game - with or without timer */
function startGame () {
    resultIndicator.innerHTML = "";
    clearInterval(timerInterval);
    currentTurn = "W";
    boardArray = constructBoardArray();
    clearBoard();
    placePieces(boardArray);
    document.getElementsByClassName("white-timer")[0].classList.add("current-timer");
    document.getElementsByClassName("black-timer")[0].classList.remove("current-timer");
    gameStarted = true;
    document.getElementsByClassName("timer-button")[0].innerHTML = "New game";
    if (chosenTime === 0) {
        document.getElementsByClassName("white-timer-minutes")[0].innerHTML = "00";
        document.getElementsByClassName("white-timer-seconds")[0].innerHTML = "00";
        document.getElementsByClassName("black-timer-minutes")[0].innerHTML = "00";
        document.getElementsByClassName("black-timer-seconds")[0].innerHTML = "00";
        return;
    }
    document.getElementsByClassName("white-timer")[0].classList.add("current-timer");
    timeRemainingBlack = chosenTime * 60;
    timeRemainingWhite = chosenTime * 60;
    document.getElementsByClassName("white-timer-minutes")[0].innerHTML = minutesAndSeconds(timeRemainingWhite)[0];
    document.getElementsByClassName("white-timer-seconds")[0].innerHTML = "00";
    document.getElementsByClassName("black-timer-minutes")[0].innerHTML = minutesAndSeconds(timeRemainingBlack)[0];
    document.getElementsByClassName("black-timer-seconds")[0].innerHTML = "00";
    countDown();
    timerInterval = setInterval(countDown, 1000);
}

/* Executes every second and changes the active timer */
function countDown () {
    let timeRemainingMinutesSeconds;
    switch (currentTurn) {
    case "W":
        timeRemainingMinutesSeconds = minutesAndSeconds(timeRemainingWhite);
        document.getElementsByClassName("white-timer-minutes")[0].innerHTML = timeRemainingMinutesSeconds[0];
        document.getElementsByClassName("white-timer-seconds")[0].innerHTML = timeRemainingMinutesSeconds[1];
        timeRemainingWhite--;
        break;
    case "B":
        timeRemainingMinutesSeconds = minutesAndSeconds(timeRemainingBlack);
        document.getElementsByClassName("black-timer-minutes")[0].innerHTML = timeRemainingMinutesSeconds[0];
        document.getElementsByClassName("black-timer-seconds")[0].innerHTML = timeRemainingMinutesSeconds[1];
        timeRemainingBlack--;
        break;
    }
    if (timeRemainingBlack === -1) {
        document.getElementsByClassName("result-indicator")[0].innerHTML = "White has won on time.";
        gameStarted = false;
        clearInterval(timerInterval);
    } else if (timeRemainingWhite === -1) {
        document.getElementsByClassName("result-indicator")[0].innerHTML = "Black has won on time.";
        gameStarted = false;
        clearInterval(timerInterval);
    }
}


/* ACTION FUNCTION */

/* Event triggered when a square is clicked - select or make move */
function squareClick (event) {
    if (!gameStarted) {
        return;
    }
    if (pieceSelectedBool) {
        /* Deselect if same square is clicked */
        if (selectedSquareId === event.target.id) {
            pieceSelectedBool = false;
            selectedSquareId = "";
            event.target.classList.remove("selected");
        } else {
            if (attemptMove(event)) {
                pieceSelectedBool = false;
                selectedSquareId = "";
            }
        }
    } else {
        selectSquare(event);
    }
}

/* Make a square the selected one to start a move, if there's a piece. */
function selectSquare (event) {
    const piece = boardArray[event.target.id.charAt(0)][event.target.id.charAt(1)];
    if (event.target.classList.contains("occupied") && piece.charAt(0) === currentTurn) {
        event.target.classList.add("selected");
        pieceSelectedBool = true;
        selectedSquareId = event.target.id;
    }
}

/* Attempt to make a move based on user click */
function attemptMove (event) {
    const selectedPiece = boardArray[selectedSquareId.charAt(0)][selectedSquareId.charAt(1)];
    const targetSquare = event.target;
    const targetPiece = boardArray[targetSquare.id.charAt(0)][targetSquare.id.charAt(1)];

    /* Stop if it's your own piece */
    if (selectedPiece.charAt(0) === targetPiece.charAt(0)) {
        return false;
    }

    /* Tries to move/take another piece */
    const startCoords = [parseInt(selectedSquareId.charAt(0)), parseInt(selectedSquareId.charAt(1))];
    const endCoords = [parseInt(targetSquare.id.charAt(0)), parseInt(targetSquare.id.charAt(1))];
    if (attemptMovement(startCoords, endCoords, selectedPiece, boardArray)) {

        /* Check for invalid move that results in check */
        const tempBoardArray = copyBoard(boardArray);
        tempBoardArray[startCoords[0]][startCoords[1]] = "Empty";
        tempBoardArray[endCoords[0]][endCoords[1]] = selectedPiece;
        if (currentTurn === "B" && checkForCheck("W", tempBoardArray)) {
            return false;
        } else if (currentTurn === "W" && checkForCheck("B", tempBoardArray)) {
            return false;
        }

        /* Special rook-changes if the move is a a valid castle (Checked in attemptMovement()) */
        if (selectedPiece === "WKing" && compareCoords(startCoords, [4, 0])) {
            if (compareCoords(endCoords, [2, 0])) {
                boardArray[3][0] = "WRook";
                boardArray[0][0] = "Empty";
            } else if (compareCoords(endCoords, [6, 0])) {
                boardArray[5][0] = "WRook";
                boardArray[7][0] = "Empty";
            }
        } else if (selectedPiece === "BKing" && compareCoords(startCoords, [4, 7])) {
            if (compareCoords(endCoords, [2, 7])) {
                boardArray[3][7] = "BRook";
                boardArray[0][7] = "Empty";
            } else if (compareCoords(endCoords, [6, 7])) {
                boardArray[5][7] = "BRook";
                boardArray[7][7] = "Empty";
            }
        }

        /* En passant capture if valid en passant */
        if (checkIfDiagonal(startCoords, endCoords, boardArray) && targetPiece === "Empty") {
            switch (selectedPiece) {
            case "WPawn":
                boardArray[endCoords[0]][endCoords[1] - 1] = "Empty";
                break;
            case "BPawn":
                boardArray[endCoords[0]][endCoords[1] + 1] = "Empty";
                break;
            }
        }

        /* Saves the captured piece to display on the side */
        if (targetPiece !== "Empty") {
            let display;
            switch (targetPiece.charAt(0)) {
            case "W":
                capturedWhitePieces.push(targetPiece);
                display = capturedPiecesDisplay(capturedWhitePieces, "W");
                document.getElementsByClassName("white-pieces-captured", "W")[0].innerHTML = display;
                break;
            case "B":
                capturedBlackPieces.push(targetPiece);
                display = capturedPiecesDisplay(capturedBlackPieces, "B");
                document.getElementsByClassName("black-pieces-captured")[0].innerHTML = display;
                break;
            }
        }

        /* Moves piece */
        boardArray[startCoords[0]][startCoords[1]] = "Empty";
        boardArray[endCoords[0]][endCoords[1]] = selectedPiece;

        /* Tries to promote pawn */
        if (promotePawn([endCoords[0], endCoords[1]], selectedPiece)) {
            promotionShowOrHide(currentTurn);
            promotionCoords = endCoords;
        }

        /* Clears css classnames from squares ("Occupied", "checked" etc) */
        clearBoard();

        /* Visually places new pieces on the board */
        placePieces(boardArray);

        /* Visualize last move with yellow squares */
        document.getElementById(startCoords.join("")).classList.add("move-square");
        document.getElementById(endCoords.join("")).classList.add("move-square");

        lookForCheckOrMate();
        changeTurn();

        return true;
    }
}

/* PROMOTION FUNCTIONS */

/* Initializes the promotion option picker */
function promotionInitialize() {
    let options = document.getElementsByClassName("promotion-option");
    for(let i = 0; i < options.length; i++){
        options[i].addEventListener("click",promotionChoice);
    }
    document.getElementsByClassName("black-promotion-div")[0].style.display = "none";
    document.getElementsByClassName("white-promotion-div")[0].style.display = "none";
}

/* Shows or hides the promotion option box for a player */
function promotionShowOrHide(player){
    if (player === "W"){
        if(document.getElementsByClassName("white-promotion-div")[0].style.display === "inline-block"){
            document.getElementsByClassName("white-promotion-div")[0].style.display = "none";
        } else if(document.getElementsByClassName("white-promotion-div")[0].style.display === "none"){
            document.getElementsByClassName("white-promotion-div")[0].style.display = "inline-block";
        }
    } else if (player === "B"){
        if(document.getElementsByClassName("black-promotion-div")[0].style.display === "inline-block"){
            document.getElementsByClassName("black-promotion-div")[0].style.display = "none";
        } else if(document.getElementsByClassName("black-promotion-div")[0].style.display === "none"){
            document.getElementsByClassName("black-promotion-div")[0].style.display = "inline-block";
        }
    }
}

/* Translates a promotion choice to a piece */
function promotionChoice(event){
    let optionId = event.target.id;
    let pickedPiece = optionId.slice(8);
    boardArray[promotionCoords[0]][promotionCoords[1]] = pickedPiece;
    placePieces(boardArray);
    promotionShowOrHide(optionId.charAt(8));
    lookForCheckOrMate();
}


/* HELPER FUNCTIONS */

/* Checks for checks or possible mates. Changes visuals or ends the game */
function lookForCheckOrMate(){
    if (checkForCheck("W", boardArray)) {
        const kingIndex = findPieceIndex("BKing", boardArray);
        const kingSquare = kingIndex.join("");
        document.getElementById(kingSquare).classList.add("checked-square");
        if (checkForMate(boardArray, "B", "W")) {
            resultIndicator.innerHTML = "White has won by check mate";
            gameStarted = false;
        }
    } else if (checkForCheck("B", boardArray)) {
        const kingIndex = findPieceIndex("WKing", boardArray);
        const kingSquare = kingIndex.join("");
        document.getElementById(kingSquare).classList.add("checked-square");
        if (checkForMate(boardArray, "W", "B")) {
            resultIndicator.innerHTML = "Black has won by check mate";
            gameStarted = false;
        }
    }
}

/* Changes player turn */
function changeTurn(){
    if (currentTurn === "W") {
        currentTurn = "B";
        document.getElementsByClassName("black-timer")[0].classList.add("current-timer");
        document.getElementsByClassName("white-timer")[0].classList.remove("current-timer");
    } else {
        currentTurn = "W";
        document.getElementsByClassName("white-timer")[0].classList.add("current-timer");
        document.getElementsByClassName("black-timer")[0].classList.remove("current-timer");
    }
}