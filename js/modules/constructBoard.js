function constructBoard () {
    for (let i = 7; i > -1; i--) {
        for (let j = 0; j < 8; j++) {
            const newSquare = document.createElement("div");
            newSquare.id = j.toString() + i.toString();
            document.getElementsByClassName("chessboard")[0].appendChild(newSquare);
            newSquare.className = "click-square";
            const newBackgroundSquare = document.createElement("div");
            document.getElementsByClassName("board-background")[0].appendChild(newBackgroundSquare);
            if ((j % 2 === 0 && i % 2 === 1) || (j % 2 === 1 && i % 2 === 0)) {
                newBackgroundSquare.className = "white-background-square";
            } else {
                newBackgroundSquare.className = "black-background-square";
            }
        }
    }
}

function constructBoardArray () {
    const boardArray = [];
    boardArray.push(["WRook", "WPawn", "Empty", "Empty", "Empty", "Empty", "BPawn", "BRook"]);
    boardArray.push(["WKnight", "WPawn", "Empty", "Empty", "Empty", "Empty", "BPawn", "BKnight"]);
    boardArray.push(["WBishop", "WPawn", "Empty", "Empty", "Empty", "Empty", "BPawn", "BBishop"]);
    boardArray.push(["WQueen", "WPawn", "Empty", "Empty", "Empty", "Empty", "BPawn", "BQueen"]);
    boardArray.push(["WKing", "WPawn", "Empty", "Empty", "Empty", "Empty", "BPawn", "BKing"]);
    boardArray.push(["WBishop", "WPawn", "Empty", "Empty", "Empty", "Empty", "BPawn", "BBishop"]);
    boardArray.push(["WKnight", "WPawn", "Empty", "Empty", "Empty", "Empty", "BPawn", "BKnight"]);
    boardArray.push(["WRook", "WPawn", "Empty", "Empty", "Empty", "Empty", "BPawn", "BRook"]);
    return boardArray;
}

export { constructBoard, constructBoardArray };
