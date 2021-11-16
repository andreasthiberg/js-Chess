function constructBoard(){
    for (let i = 7; i > -1; i--){
        for (let j = 0; j < 8; j++){
            let newSquare = document.createElement("div");
            newSquare.id = j.toString() + i.toString();
            document.getElementsByClassName("chessboard")[0].appendChild(newSquare);
            if ((j % 2 == 0 && i % 2 == 1) || (j % 2 == 1 && i % 2 == 0)){
                newSquare.className = "white-square";
            } else {
                newSquare.className = "black-square"
            }
        }
    }
}

function constructBoardArray(){
    let boardArray = [];
    boardArray.push(["WRook","WPeasant","Empty","Empty","Empty","Empty","BPeasant","BRook"]);
    boardArray.push(["WKnight","WPeasant","Empty","Empty","Empty","Empty","BPeasant","BKnight"]);
    boardArray.push(["WBishop","WPeasant","Empty","Empty","Empty","Empty","BPeasant","BBishop"]);
    boardArray.push(["WQueen","WPeasant","Empty","Empty","Empty","Empty","BPeasant","BQueen"]);
    boardArray.push(["WKing","WPeasant","Empty","Empty","Empty","Empty","BPeasant","BKing"]);
    boardArray.push(["WBishop","WPeasant","Empty","Empty","Empty","Empty","BPeasant","BBishop"]);
    boardArray.push(["WKnightook","WPeasant","Empty","Empty","Empty","Empty","BPeasant","BKnight"]);
    boardArray.push(["WRook","WPeasant","Empty","Empty","Empty","Empty","BPeasant","BRook"]);
    return boardArray;
}

export { constructBoard, constructBoardArray };