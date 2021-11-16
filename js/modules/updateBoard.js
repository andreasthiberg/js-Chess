function placePieces(boardArray){
    for(let i = 0 ; i < 8; i++ ){
        for(let j = 0; j < 8; j++){
            let currentSquarePiece = boardArray[i][j];
            let currentSquareId = i.toString() + j.toString();
            let currentSquareElement = document.getElementById(currentSquareId);
            currentSquareElement.classList.add(currentSquarePiece);
            if (currentSquarePiece !== "Empty"){
                currentSquareElement.classList.add("occupied");
            }
            
            switch(currentSquarePiece){
                case "WRook":
                    currentSquareElement.innerHTML = "r";
                    currentSquareElement.style.color = "white";
                    break;
                case "BRook":
                    currentSquareElement.innerHTML = "t";
                    break;
                case "WBishop":
                    currentSquareElement.innerHTML = "b";
                    currentSquareElement.style.color = "white";
                    break;
                case "WKnight":
                    currentSquareElement.innerHTML = "h";
                    currentSquareElement.style.color = "white";
                    break;
                case "WQueen":
                    currentSquareElement.innerHTML = "q";
                    currentSquareElement.style.color = "white";
                    break;
                case "WKing":
                        currentSquareElement.innerHTML = "k";
                        currentSquareElement.style.color = "white";
                        break;
                case "WPeasant":
                        currentSquareElement.innerHTML = "p";
                        currentSquareElement.style.color = "white";
                        break;
                case "BBishop":
                        currentSquareElement.innerHTML = "n";
                        break;
                case "BKnight":
                        currentSquareElement.innerHTML = "j";
                        break;
                case "BPeasant":
                        currentSquareElement.innerHTML = "o";
                        break;
                case "BKing":
                        currentSquareElement.innerHTML = "l";
                        break;
                case "BQueen":
                        currentSquareElement.innerHTML = "w";
                        break;
                case "Empty":
                        currentSquareElement.innerHTML = "s";
                        break;
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

/* Tries to convert peasant */
function convertPeasant(coords,boardArray,piece){
    if(piece === "WPeasant" || piece === "BPeasant"){
        console.log(coords);
        if(coords[1] === "7" || coords[1] === "0"){
            console.log("Hej");
            boardArray[coords[0]][coords[1]] = piece.charAt(0) + "Queen";
        }
    } 
}

export { placePieces, clearBoard, convertPeasant};