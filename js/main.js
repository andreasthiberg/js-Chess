import { constructBoard, constructBoardArray} from './modules/constructBoard.js'; 
import { placePieces, clearBoard, convertPeasant } from './modules/updateBoard.js';
import { attemptMovement} from './modules/movements.js';

let boardArray = [];

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

let pieceSelectedBool = false;
let selectedSquareId = "";

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
    if (event.target.classList.contains("occupied")){
        event.target.classList.add("selected");
        pieceSelectedBool = true;
        selectedSquareId = event.target.id;
    }
}


function attemptMove(event){
    let selectedSquare = document.getElementById("selectedPieceId");
    let selectedPiece = boardArray[selectedSquareId.charAt(0)][selectedSquareId.charAt(1)];
    let targetSquare = event.target;
    let targetPiece = boardArray[targetSquare.id.charAt(0)][targetSquare.id.charAt(1)];
    
    /* Stop if it's your own piece */
    if(selectedPiece.charAt(0) === targetPiece.charAt(0)){
        return false;
    }

    /* Tries to move/take another piece */
        if(attemptMovement(selectedSquareId,targetSquare.id,selectedPiece,boardArray)){
            boardArray[selectedSquareId.charAt(0)][selectedSquareId.charAt(1)] = "Empty";
            boardArray[targetSquare.id.charAt(0)][targetSquare.id.charAt(1)] = selectedPiece;
            convertPeasant([targetSquare.id.charAt(0),targetSquare.id.charAt(1)],boardArray,selectedPiece);
            clearBoard();
            placePieces(boardArray);
            return true;
        }

}

