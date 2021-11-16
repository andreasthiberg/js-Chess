import { constructBoard, constructBoardArray} from './modules/constructBoard.js'; 
import { placePieces, clearBoard } from './modules/updateBoard.js';

let pieceSelected = false;
(function (){

    /* Construct chessboard and add eventlisteners to squares. 
    Squares have IDs of 00 to 77, corresponding to A1 to H8 */
    constructBoard();
    let squares = document.querySelectorAll(".white-square,.black-square");
    for(let i = 0; i < squares.length; i++){
        squares[i].addEventListener("click",squareClick);
    }
    

    /* Construct chessboard array. [0][0] is square A1, [1,0] is B1, etc. [7,7] is square H8 */
    let boardArray = constructBoardArray();

    /* Place the visual pieces according to array */ 
    placePieces(boardArray);
    
})();

function squareClick(event){
    if(pieceSelected){
        attemptMove(event);
    }
    else {
        selectSquare(event);
    }
}

/* Make a square the selected one to start a move, if there's a piece. */
function selectSquare(event){
    if (event.target.classList.contains("occupied")){
        event.target.classList.add("selected");
        pieceSelected = true;
    }
}