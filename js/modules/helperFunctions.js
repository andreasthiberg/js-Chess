/* Finds the (two-deep) index of a piece in the board array: Example return: [2][5] */
function findPieceIndex (piece, boardArray) {
    let foundIndex = -1;
    for (let i = 0; i < boardArray.length; i++) {
        foundIndex = boardArray[i].indexOf(piece);
        if (foundIndex !== -1) {
            return [i, foundIndex];
        }
    }
    return [];
}

/* Compares two coordinate-arrays such as [0,2] and [0,1] */
function compareCoords (a, b) {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

/* Returns a copy of the board for stopping moves when checked */
function copyBoard (boardArray) {
    const copy = [];
    for (let i = 0; i < boardArray.length; i++) {
        copy.push([...boardArray[i]]);
    }
    return copy;
}

function minutesAndSeconds (seconds) {
    let minutes = Math.floor(seconds / 60);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    let secondsRemaining = seconds - minutes * 60;
    if (secondsRemaining < 10) {
        secondsRemaining = "0" + secondsRemaining;
    }
    return [minutes, secondsRemaining];
}

function capturedPiecesDisplay (capturedPieces, color) {
    const pieceTypes = ["Queen", "Rook", "Bishop", "Knight", "Pawn"];
    const blackChars = ["w", "t", "n", "j", "o"];
    const whiteChars = ["q", "r", "b", "h", "p"];
    const sortedPieces = [];
    let matchingPieces = [];
    for (let i = 0; i < pieceTypes.length; i++) {
        matchingPieces = capturedPieces.filter(x => x.includes(pieceTypes[i]));
        for (let j = 0; j < matchingPieces.length; j++) {
            switch (color) {
            case "W":
                sortedPieces.push(whiteChars[i]);
                break;
            case "B":
                sortedPieces.push(blackChars[i]);
                break;
            }
        }
    }
    return sortedPieces.join("");
}

function getPieceFontLetter(piece) {
    let pieceWithoutColor = piece.slice(1);
    switch (pieceWithoutColor) {
        case "King":
            return "l";
            break;
        case "Queen":
            return "w";
            break;
        case "Rook":
            return "t";
            break;
        case "Bishop":
            return "n";
            break;
        case "Knight":
            return "j";
            break;
        case "Pawn":
            return "o";
            break;
    }
    return "No match";
}
export { findPieceIndex, compareCoords, copyBoard, minutesAndSeconds, capturedPiecesDisplay, getPieceFontLetter };
