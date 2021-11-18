import { constructBoard, constructBoardArray} from './modules/constructBoard.js'; 
import { placePieces, clearBoard, convertPawn } from './modules/updateBoard.js';
import { attemptMovement, checkForCheck, checkIfDiagonal} from './modules/movements.js';
import { compareCoords, copyBoard } from './modules/helperFunctions.js';

let boardArray = [];
let currentTurn = "W";
let pieceSelectedBool = false;
let selectedSquareId = "";
let checkIndicator = "";

(function (){

    /* Construct chessboard and add eventlisteners to squares. 
    Squares have IDs of 00 to 77, corresponding to A1 to H8 */
    constructBoard();
    let squares = document.querySelectorAll(".white-square,.black-square");
    for(let i = 0; i < squares.length; i++){
        squares[i].addEventListener("click",squareClick);
    }
    
    /* Construct chessboard array. [0][0] is square A1, [1,0] is B1, etc. [7,7] is square H8 */
    boardArray = constructBoardArray();

    /* Place the visual pieces according to array */ 
    placePieces(boardArray);

})();

/* Event triggered when a square is click - select or make move */
function squareClick(event){
    if(pieceSelectedBool){
        /* Deselect if same square is clicked */
        if (selectedSquareId === event.target.id){
            pieceSelectedBool = false;
            selectedSquareId = "";
            event.target.classList.remove("selected");
        } else {
            if(attemptMove(event)){
                pieceSelectedBool = false;
                selectedSquareId = "";
            }
        }
    }
    else {
        selectSquare(event);
    }
}

/* Make a square the selected one to start a move, if there's a piece. */
function selectSquare(event){
    let piece = boardArray[event.target.id.charAt(0)][event.target.id.charAt(1)];  
    if (event.target.classList.contains("occupied") && piece.charAt(0) === currentTurn){
        event.target.classList.add("selected");
        pieceSelectedBool = true;
        selectedSquareId = event.target.id;
    }
}

/* Attempt to make a move based on user click */
function attemptMove(event){
    let selectedPiece = boardArray[selectedSquareId.charAt(0)][selectedSquareId.charAt(1)];
    let targetSquare = event.target;
    let targetPiece = boardArray[targetSquare.id.charAt(0)][targetSquare.id.charAt(1)];
    
    /* Stop if it's your own piece */
    if(selectedPiece.charAt(0) === targetPiece.charAt(0)){
        return false;
    }

    /* Tries to move/take another piece */
    let startCoords = [parseInt(selectedSquareId.charAt(0)),parseInt(selectedSquareId.charAt(1))];
    let endCoords = [parseInt(targetSquare.id.charAt(0)),parseInt(targetSquare.id.charAt(1))];
    if(attemptMovement(startCoords,endCoords,selectedPiece,boardArray)){

        /* Check for invalid move if checked */
        let tempBoardArray = copyBoard(boardArray);
        tempBoardArray[selectedSquareId.charAt(0)][selectedSquareId.charAt(1)] = "Empty";
        tempBoardArray[targetSquare.id.charAt(0)][targetSquare.id.charAt(1)] = selectedPiece;
        if(currentTurn == "B" && checkForCheck("W",tempBoardArray)){
            return false;
        } else if (currentTurn == "W" && checkForCheck("B",tempBoardArray)){
            return false;
        }

        /* Special rook-changes if the move is a a valid castle (Checked in attemptMovement()) */
        if(selectedPiece === "WKing" && compareCoords(startCoords,[4,0])){
            if(compareCoords(endCoords,[2,0])){
                boardArray[3][0] = "WRook";
                boardArray[0][0] = "Empty";
            } else if(compareCoords(endCoords,[6,0])){
                boardArray[5][0] = "WRook";
                boardArray[7][0] = "Empty";
            }
        } else if (selectedPiece === "BKing" && compareCoords(startCoords,[4,7])){
                if(compareCoords(endCoords,[2,7])){
                    boardArray[3][7] = "BRook";
                    boardArray[0][7] = "Empty";
                } else if(compareCoords(endCoords,[6,7])){
                    boardArray[5][7] = "BRook";
                    boardArray[7][7] = "Empty";
                }
        }

        /* En passant capture if valid en passant */
        if(checkIfDiagonal(startCoords,endCoords) && targetPiece === "Empty"){
            switch(selectedPiece){
                case "WPawn":
                    boardArray[endCoords[0]][endCoords[1]-1] = "Empty";
                    break;
                case "BPawn":
                    boardArray[endCoords[0]][endCoords[1]+1] = "Empty";
                    break;
            }
        }
    
        /* Moves piece */
        boardArray[selectedSquareId.charAt(0)][selectedSquareId.charAt(1)] = "Empty";
        boardArray[targetSquare.id.charAt(0)][targetSquare.id.charAt(1)] = selectedPiece;

        /* Tries to convert Pawns to queens */
        convertPawn([targetSquare.id.charAt(0),targetSquare.id.charAt(1)],boardArray,selectedPiece);

        /* Clears html classnames from squares (Occupied) */
        clearBoard();

        /*Visually places new pieces on the board */
        placePieces(boardArray);
        
        /* Change turn and look for check */
        if (currentTurn === "W"){
            currentTurn = "B";
            document.getElementsByClassName("turn-indicator")[0].innerHTML = "Black's turn.";
        } else {
            currentTurn = "W";
            document.getElementsByClassName("turn-indicator")[0].innerHTML = "White's turn.";
        }
        if(checkForCheck("W", boardArray)){
            checkIndicator = "W";
            document.getElementsByClassName("check-indicator")[0].innerHTML = "White check.";
        } else if(checkForCheck("B",boardArray)){
            checkIndicator = "B";
            document.getElementsByClassName("check-indicator")[0].innerHTML = "Black check.";
        } else {
            checkIndicator = "";
            document.getElementsByClassName("check-indicator")[0].innerHTML = "No check.";
        }
    return true;
    }
}



