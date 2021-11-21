import { findPieceIndex, compareCoords, copyBoard } from "./helperFunctions.js";

/* Variables that disable when rook or king is moved castling */
let wCastlingAllowed;
let bCastlingAllowed;

/* Keeps track of possible en passant move */
let lastEnPassant = [];
let enPassantAllowed = false;

/* Tries to make a move according to the type of piece. Disallows en passant on next move if successful (excludes pawn movement, see pawn function */
function attemptMovement (startCoords, endCoords, piece, boardArray, wCastling, bCastling, lastEP, ePAllowed) {
    wCastlingAllowed = wCastling;
    bCastlingAllowed = bCastling;
    lastEnPassant = lastEP;
    enPassantAllowed = ePAllowed;

    if (piece === "WPawn" || piece === "BPawn") {
        return movePawn(startCoords, endCoords, piece, boardArray);
    } else if (piece === "WQueen" || piece === "BQueen") {
        if (moveQueen(startCoords, endCoords, boardArray)) {
            return true;
        }
    } else if (piece === "WBishop" || piece === "BBishop") {
        if (moveBishop(startCoords, endCoords, boardArray)) {
            return true;
        }
    } else if (piece === "WRook" || piece === "BRook") {
        if (moveRook(startCoords, endCoords, boardArray, piece)) {
            return true;
        }
    } else if (piece === "WKing" || piece === "BKing") {
        if (moveKing(startCoords, endCoords, piece, boardArray)) {
            return true;
        }
    } else if (piece === "WKnight" || piece === "BKnight") {
        if (moveKnight(startCoords, endCoords)) {
            return true;
        }
    }
}

/* MOVEMENT FOR DIFFERENT PIECES - Ordered by complexity - King and Pawn with castling/special-move options. */

/* Castling and normal moves for the King */
function moveKing (start, end, piece, boardArray) {
    /* Checks for valid castling move. Includes checks for threatened intermediary squares via castlingCheckControl(). */
    if (piece === "WKing") {
        if (compareCoords(end, [2, 0]) && checkIfLine(start, [0, 0], boardArray) && wCastlingAllowed[0]) {
            if (castlingCheckControl(start, end, "W", "B", boardArray)) {
                return false;
            }
            return true;
        } else if (compareCoords(end, [6, 0]) && checkIfLine(start, [7, 0], boardArray) && wCastlingAllowed[1]) {
            if (castlingCheckControl(start, end, "W", "B", boardArray)) {
                return false;
            }
            return true;
        }
    } else if (piece === "BKing") {
        if (compareCoords(end, [2, 7]) && checkIfLine(start, [0, 7], boardArray) && bCastlingAllowed[0]) {
            if (castlingCheckControl(start, end, "B", "W", boardArray)) {
                return false;
            }
            return true;
        } else if (compareCoords(end, [6, 7]) && checkIfLine(start, [7, 7], boardArray) & bCastlingAllowed[1]) {
            if (castlingCheckControl(start, end, "B", "W", boardArray)) {
                return false;
            }
            return true;
        }
    }

    /* Makes normal one-step move and disables castling. */
    const xDiff = Math.abs(start[0] - end[0]);
    const yDiff = Math.abs(start[1] - end[1]);
    if (yDiff > 1 || xDiff > 1) {
        return false;
    }
    return true;
}

/* Helper function to check if intermediate squares are threatened when castling */
function castlingCheckControl (startCoords, endCoords, checkedPlayer, checkingPlayer, boardArray) {
    const boardsToTest = [copyBoard(boardArray)];
    const boardWithoutKing = copyBoard(boardArray);
    boardWithoutKing[startCoords[0]][startCoords[1]] = "Empty";
    const yCoord = endCoords[1];
    const xCoord = endCoords[0];
    let tempBoardVar;

    /* Castling Queen's or King's side */
    if (xCoord === 2) {
        for (let i = 1; i < 4; i++) {
            tempBoardVar = copyBoard(boardWithoutKing);
            tempBoardVar[i][yCoord] = checkedPlayer + "King";
            boardsToTest.push(tempBoardVar);
        }
    } else if (xCoord === 6) {
        for (let i = 5; i < 7; i++) {
            tempBoardVar = copyBoard(boardWithoutKing);
            tempBoardVar[i][yCoord] = checkedPlayer + "King";
            boardsToTest.push(tempBoardVar);
        }
    }

    /* Check if any intermediary squares can be checked */

    for (let i = 0; i < boardsToTest.length; i++) {
        if (checkForCheck(checkingPlayer, boardsToTest[i])) {
            return true;
        }
    }
    return false;
}

/* Normal, two-step and capture pawn movements. Enables or disables en passant based on move type. */
function movePawn (start, end, piece, boardArray) {
    let startY = 0;
    let upOrDown = 0;

    /* Sets movement direction based on color. */
    if (piece === "WPawn") {
        upOrDown = 1;
        startY = 1;
    } else {
        upOrDown = -1;
        startY = 6;
    }

    /* Check double step, then normal step, then en passant.  */
    if (boardArray[end[0]][end[1]] === "Empty") {
        if (start[1] === end[1] + (-2 * upOrDown) && start[0] === end[0] && start[1] === startY && checkIfLine(start, end, boardArray)) {
            return true;
        } else if (start[1] === end[1] - upOrDown && start[0] === end[0]) {
            return true;
        } else if (start[1] === end[1] - upOrDown && Math.abs(start[0] - end[0]) === 1 && compareCoords(lastEnPassant, end) && enPassantAllowed) {
            return true;
        }
    } else if (start[1] === end[1] - upOrDown && Math.abs(start[0] - end[0]) === 1) {
        // Check diagonal movement to enemy square.
        return true;
    }
    return false;
}

function moveRook (start, end, boardArray) {
    if (checkIfLine(start, end, boardArray)) {
        return true;
    }
    return false;
}

function moveQueen (start, end, boardArray) {
    if (checkIfLine(start, end, boardArray)) {
        return true;
    } else if (checkIfDiagonal(start, end, boardArray)) {
        return true;
    }
    return false;
}

function moveBishop (start, end, boardArray) {
    if (checkIfDiagonal(start, end, boardArray)) {
        return true;
    }
    return false;
}

function moveKnight (start, end) {
    const xDiff = Math.abs(start[0] - end[0]);
    const yDiff = Math.abs(start[1] - end[1]);
    if ((xDiff === 2 && yDiff === 1) || (xDiff === 1 && yDiff === 2)) {
        return true;
    } else {
        return false;
    }
}

/* Checks if there's an (empty) diagonal between two squares */
function checkIfDiagonal (start, end, boardArray) {
    const xDiff = end[0] - start[0];
    const yDiff = end[1] - start[1];
    const yDir = yDiff / Math.abs(yDiff);
    const xDir = xDiff / Math.abs(xDiff);

    if (Math.abs(yDiff) !== Math.abs(xDiff)) {
        return false;
    }
    for (let i = 1; i < Math.abs(yDiff); i++) {
        const coords = [start[0] + i * xDir, start[1] + i * yDir];
        if (boardArray[coords[0]][coords[1]] !== "Empty") { return false; }
    }
    return true;
}

/* Checks if there's an (empty) line between two squares */
function checkIfLine (start, end, boardArray) {
    if (!(start[0] === end[0] || start[1] === end[1])) {
        return false;
    } else if (start[0] === end[0]) {
        const diff = end[1] - start[1];
        const dir = diff / Math.abs(diff);
        for (let i = 1; i < Math.abs(diff); i++) {
            const coords = [start[0], start[1] + i * dir];
            if (boardArray[coords[0]][coords[1]] !== "Empty") {
                return false;
            }
        }
    } else {
        const diff = end[0] - start[0];
        const dir = diff / Math.abs(diff);
        for (let i = 1; i < Math.abs(diff); i++) {
            const coords = [start[0] + i * dir, start[1]];
            if (boardArray[coords[0]][coords[1]] !== "Empty") {
                return false;
            }
        }
    }
    return true;
}

/* Checks if any piece checks the enemy king. */
function checkForCheck (checkingPlayer, boardArray) {
    let enemyKingCoords = [];
    switch (checkingPlayer) {
    case "W":
        enemyKingCoords = findPieceIndex("BKing", boardArray);
        break;
    case "B":
        enemyKingCoords = findPieceIndex("WKing", boardArray);
        break;
    }
    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[0].length; j++) {
            if (boardArray[i][j].charAt(0) === checkingPlayer) {
                if (attemptMovement([i, j], enemyKingCoords, boardArray[i][j], boardArray)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function checkForMate (boardArray, checkedPlayer, checkingPlayer) {
    /* First find indexes for pieces of the checked player */
    const checkedPlayerPieces = [];
    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[0].length; j++) {
            if (boardArray[i][j].charAt(0) === checkedPlayer) {
                checkedPlayerPieces.push([i, j]);
            }
        }
    }

    /* Go through each piece to attempt possible check-solutions */
    for (let i = 0; i < checkedPlayerPieces.length; i++) {
        const xStart = checkedPlayerPieces[i][0];
        const yStart = checkedPlayerPieces[i][1];
        const piece = boardArray[xStart][yStart];

        /* Go through every square and move there, then check if it solves the check. */
        if (lookForCheckSolution(boardArray, [xStart, yStart], piece, checkingPlayer, checkedPlayer)) {
            return false;
        }
    }
    return true;
}

function lookForCheckSolution (boardArray, startCoords, piece, checkingPlayer, checkedPlayer) {
    let tempBoardArray;
    for (let i = 0; i < (boardArray.length); i++) {
        for (let j = 0; j < (boardArray.length); j++) {
            if (attemptMovement(startCoords, [i, j], piece, boardArray) && boardArray[i][j].charAt(0) !== checkedPlayer) {
                tempBoardArray = copyBoard(boardArray);
                tempBoardArray[i][j] = piece;
                tempBoardArray[startCoords[0]][startCoords[1]] = "Empty";
                if (!checkForCheck(checkingPlayer, tempBoardArray)) {
                    return true;
                }
            }
        }
    }
}

export { attemptMovement, checkForCheck, checkIfDiagonal, checkForMate };
