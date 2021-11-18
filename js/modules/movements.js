import { findPieceIndex, compareCoords, copyBoard } from "./helperFunctions.js";

/* Variables that disable when rook or king is moved castling */
let wCastleAllowed = [true, true];
let bCastleAllowed = [true, true];

/* Keeps track of possible en passant move */
let lastEnPassant = [];
let enPassantAllowed = false;

/* Tries to make a move according to the type of piece. Disallows en passant on next move if successful (excludes pawn movement, see pawn function */
function attemptMovement (startCoords, endCoords, piece, boardArray) {
    if (piece === "WPawn" || piece === "BPawn") {
        return movePawn(startCoords, endCoords, piece, boardArray);
    } else if (piece === "WQueen" || piece === "BQueen") {
        if (moveQueen(startCoords, endCoords, boardArray)) {
            enPassantAllowed = false;
            return true;
        }
    } else if (piece === "WBishop" || piece === "BBishop") {
        if (moveBishop(startCoords, endCoords, boardArray)) {
            enPassantAllowed = false;
            return true;
        }
    } else if (piece === "WRook" || piece === "BRook") {
        if (moveRook(startCoords, endCoords, boardArray, piece)) {
            enPassantAllowed = false;
            return true;
        }
    } else if (piece === "WKing" || piece === "BKing") {
        if (moveKing(startCoords, endCoords, piece, boardArray)) {
            enPassantAllowed = false;
            return true;
        }
    } else if (piece === "WKnight" || piece === "BKnight") {
        if (moveKnight(startCoords, endCoords)) {
            enPassantAllowed = false;
            return true;
        }
    }
}

/* MOVEMENT FOR DIFFERENT PIECES - Ordered by complexity - King and Pawn with castling/special-move options. */

/* Castling and normal moves for the King */
function moveKing (start, end, piece, boardArray) {
    /* Checks for valid castling move. Includes checks for threatened intermediary squares via castlingCheckControl(). */
    if (piece === "WKing") {
        if (compareCoords(end, [2, 0]) && checkIfLine(start, [0, 0], boardArray) && wCastleAllowed[0]) {
            if (castlingCheckControl(end, "W", "B", boardArray)) {
                return false;
            }
            wCastleAllowed = [false, false];
            return true;
        } else if (compareCoords(end, [6, 0]) && checkIfLine(start, [7, 0], boardArray) && wCastleAllowed[1]) {
            if (castlingCheckControl(end, "W", "B", boardArray)) {
                return false;
            }
            wCastleAllowed = [false, false];
            return true;
        }
    } else if (piece === "BKing") {
        if (compareCoords(end, [2, 7]) && checkIfLine(start, [0, 7], boardArray) && bCastleAllowed[0]) {
            if (castlingCheckControl(end, "B", "W", boardArray)) {
                return false;
            }
            bCastleAllowed = [false, false];
            return true;
        } else if (compareCoords(end, [6, 7]) && checkIfLine(start, [7, 7], boardArray) & bCastleAllowed[1]) {
            if (castlingCheckControl(end, "B", "W", boardArray)) {
                return false;
            }
            bCastleAllowed = [false, false];
            return true;
        }
    }

    /* Makes normal one-step move and disables castling. */
    const xDiff = Math.abs(start[0] - end[0]);
    const yDiff = Math.abs(start[1] - end[1]);
    if (yDiff > 1 || xDiff > 1) {
        return false;
    } else {
        if (piece.charAt(0) === "W") {
            wCastleAllowed = [false, false];
        } else {
            bCastleAllowed = [false, false];
        }
        return true;
    }
}

/* Helper function to check if intermediate squares are threatened when castling */
function castlingCheckControl (endCoords, checkedPlayer, checkingPlayer, boardArray) {
    const tempCastlingBoard = copyBoard(boardArray);
    const yCoord = endCoords[1];
    const xCoord = endCoords[0];

    /* Castling Queen's or King's side */
    if (xCoord === 2) {
        tempCastlingBoard[1][yCoord] = checkedPlayer + "King";
        tempCastlingBoard[3][yCoord] = checkedPlayer + "King";
    } else if (xCoord === 6) {
        tempCastlingBoard[5][yCoord] = checkedPlayer + "King";
    }

    /* Check if any intermediary squares can be checked */
    if (checkForCheck(checkingPlayer, tempCastlingBoard)) {
        return true;
    } else {
        return false;
    }
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

    /* Check double step, then normal step.  */
    if (boardArray[end[0]][end[1]] === "Empty") {
        if (start[1] === end[1] + (-2 * upOrDown) && start[0] === end[0] && start[1] === startY && checkIfLine(start, end, boardArray)) {
            lastEnPassant = [end[0], end[1] - upOrDown];
            enPassantAllowed = true;
            return true;
        } else if (start[1] === end[1] - upOrDown && start[0] === end[0]) {
            enPassantAllowed = false;
            return true;
        } else if (start[1] === end[1] - upOrDown && Math.abs(start[0] - end[0]) === 1 && compareCoords(lastEnPassant, end) && enPassantAllowed) {
            enPassantAllowed = false;
            return true;
        }
    } else if (start[1] === end[1] - upOrDown && Math.abs(start[0] - end[0]) === 1) {
        // Check diagonal movement to enemy square.
        enPassantAllowed = false;
        return true;
    }
    return false;
}

function moveRook (start, end, boardArray, piece) {
    if (checkIfLine(start, end, boardArray)) {
        /* Changes castling-bools based on which rook moves */
        if (piece.charAt(0) === "W") {
            if (start[0] === 0) {
                wCastleAllowed[0] = false;
            } else if (start[0] === 7) {
                wCastleAllowed[1] = false;
            }
        } else {
            if (start[0] === 0) {
                bCastleAllowed[0] = false;
            } else if (start[0] === 7) {
                bCastleAllowed[1] = false;
            }
        }
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
function checkForCheck (player, boardArray) {
    let enemyKingCoords = [];
    switch (player) {
    case "W":
        enemyKingCoords = findPieceIndex("BKing", boardArray);
        break;
    case "B":
        enemyKingCoords = findPieceIndex("WKing", boardArray);
        break;
    }
    for (let i = 0; i < boardArray.length; i++) {
        for (let j = 0; j < boardArray[0].length; j++) {
            if (boardArray[i][j].charAt(0) === player) {
                if (attemptMovement([i, j], enemyKingCoords, boardArray[i][j], boardArray)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export { attemptMovement, checkForCheck, checkIfDiagonal };
