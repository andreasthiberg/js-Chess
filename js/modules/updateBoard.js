/* Places the visual pieces in the HTML according to boardArray */
function placePieces (boardArray) {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const currentSquarePiece = boardArray[i][j];
            const currentSquareId = i.toString() + j.toString();
            const currentSquareElement = document.getElementById(currentSquareId);
            if (currentSquarePiece !== "Empty") {
                currentSquareElement.classList.add("occupied");
            }

            switch (currentSquarePiece) {
            case "WRook":
                currentSquareElement.innerHTML = "t";
                currentSquareElement.style.color = "white";
                break;
            case "BRook":
                currentSquareElement.innerHTML = "t";
                currentSquareElement.style.color = "black";
                break;
            case "WBishop":
                currentSquareElement.innerHTML = "n";
                currentSquareElement.style.color = "white";
                break;
            case "WKnight":
                currentSquareElement.innerHTML = "j";
                currentSquareElement.style.color = "white";
                break;
            case "WQueen":
                currentSquareElement.innerHTML = "w";
                currentSquareElement.style.color = "white";
                break;
            case "WKing":
                currentSquareElement.innerHTML = "l";
                currentSquareElement.style.color = "white";
                break;
            case "WPawn":
                currentSquareElement.innerHTML = "o";
                currentSquareElement.style.color = "white";
                break;
            case "BBishop":
                currentSquareElement.innerHTML = "n";
                currentSquareElement.style.color = "black";
                break;
            case "BKnight":
                currentSquareElement.innerHTML = "j";
                currentSquareElement.style.color = "black";
                break;
            case "BPawn":
                currentSquareElement.innerHTML = "o";
                currentSquareElement.style.color = "black";
                break;
            case "BKing":
                currentSquareElement.innerHTML = "l";
                currentSquareElement.style.color = "black";
                break;
            case "BQueen":
                currentSquareElement.innerHTML = "w";
                currentSquareElement.style.color = "black";
                break;
            case "Empty":
                currentSquareElement.innerHTML = "s";
                currentSquareElement.style.color = "black";
                break;
            }
        }
    }
}

/* Removes extra classes (occupied and piece) from squares */
function clearBoard () {
    const whiteSquares = document.getElementsByClassName("white-square");
    for (let i = 0; i < whiteSquares.length; i++) {
        whiteSquares[i].className = "white-square";
    }
    const blackSquares = document.getElementsByClassName("black-square");
    for (let i = 0; i < blackSquares.length; i++) {
        blackSquares[i].className = "black-square";
    }
}

/* Tries to convert Pawn */
function convertPawn (coords, boardArray, piece) {
    if (piece === "WPawn" || piece === "BPawn") {
        if (coords[1] === "7" || coords[1] === "0") {
            boardArray[coords[0]][coords[1]] = piece.charAt(0) + "Queen";
        }
    }
}

export { placePieces, clearBoard, convertPawn };
