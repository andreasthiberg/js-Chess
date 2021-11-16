function placePieces(boardArray){
    for(let i = 0 ; i < 8; i++ ){
        for(let j = 0; j < 8; j++){
            let currentSquarePiece = boardArray[i][j];
            let currentSquareId = i.toString() + j.toString();
            document.getElementById(currentSquareId).classList.add(currentSquarePiece);
            if (currentSquarePiece !== "Empty"){
                document.getElementById(currentSquareId).classList.add("occupied");
            }
        } 
    }

}

function clearBoard(){
    let whiteSquares = document.getElementsByClassName("white-square");
    for (let i = 0; i < whiteSquares.length; i++){
        whiteSquares[i].className = "white-square";
    }
    let blackSquares = document.getElementsByClassName("black-square");
    for (let i = 0; i < blackSquares.length; i++){
        blackSquares[i].className = "black-square";
    }
}

export { placePieces, clearBoard };