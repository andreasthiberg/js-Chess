function attemptMovement(start,end,piece,boardArray) {
    let startCoords = [parseInt(start.charAt(0)),parseInt(start.charAt(1))];
    let endCoords = [parseInt(end.charAt(0)),parseInt(end.charAt(1))];
    if(piece === "WPeasant" || piece === "BPeasant"){
        return movePeasant(startCoords,endCoords,piece,boardArray);
    }
    else if(piece === "WQueen" || piece === "BQueen"){
        return moveQueen(startCoords,endCoords,boardArray);
    }
    else if(piece === "WBishop" || piece === "BBishop"){
        return moveBishop(startCoords,endCoords,boardArray);
    }
    else if(piece === "WRook" || piece === "BRook"){
        return moveRook(startCoords,endCoords,boardArray);
    }
    else if(piece === "WKing" || piece === "BKing"){
        return moveKing(startCoords,endCoords);
    }
    else if(piece === "WKnight" || piece === "BKnight"){
        return moveKnight(startCoords,endCoords,boardArray);
    }
}


/* MOVEMENT FOR DIFFERENT PIECES */

function movePeasant(start,end,piece,boardArray){
    let startY = 0;
    let upOrDown = 0;

    if(piece === "WPeasant"){
        upOrDown = 1;
        startY = 1;
    } else {
        upOrDown = -1;
        startY = 6;
    }

    /*Different movement checks for peasants. Also converts to queen on last row. */
    /* Check double step, then normal step.  */
    if(boardArray[end[0]][end[1]] == "Empty"){
            if (start[1] === end[1] + (-2*upOrDown) && start[0] === end[0] && start[1] === startY){
                return true;
            } else if (start[1] === end[1] - upOrDown && start[0] === end[0]){
                return true;
            }   
    } else {

        //Check movement to enemy square.
        if(start[1] === end[1] - upOrDown && Math.abs(start[0]-end[0]) === 1){
            return true;
        }
    }

    return false;
}


function moveQueen(start,end,boardArray){
    if(checkIfLine(start,end,boardArray)){
        return true;
    } else if (checkIfDiagonal(start,end,boardArray)){
        return true;
    }
    return false;
}

function moveBishop(start,end,boardArray){
    if (checkIfDiagonal(start,end,boardArray)){
        return true;
    }
    return false;
}

function moveRook(start,end,boardArray){
    if(checkIfLine(start,end,boardArray)){
        return true;
    }
    return false;
}

function moveKing(start,end){
    let xDiff = Math.abs(start[0] - end[0]);
    let yDiff = Math.abs(start[1] - end[1]);
    if (yDiff>1 || xDiff > 1){
        return false;
    } else {
        return true;
    }
}

function moveKnight(start,end,boardArray){
    let xDiff = Math.abs(start[0] - end[0]);
    let yDiff = Math.abs(start[1] - end[1]);
    if ((xDiff === 2 && yDiff === 1) || (xDiff === 1 && yDiff === 2)){
        return true;
    } else {
        return false;
    }
}

/*Checks if there's an (empty) diagonal between two squares */
function checkIfDiagonal(start,end,boardArray){
    let xDiff = end[0] - start[0];
    let yDiff = end[1] - start[1];
    let yDir = yDiff / Math.abs(yDiff);
    let xDir = xDiff / Math.abs(xDiff);

    if (Math.abs(yDiff) !== Math.abs(xDiff)){
        return false;
    }
    for (let i = 1; i < Math.abs(yDiff);i++){
        let coords = [start[0]+i*xDir,start[1]+i*yDir];
        if (boardArray[coords[0]][coords[1]] !== "Empty")
            return false;
    }
    return true;
}

/*Checks if there's an (empty) line between two squares */
function checkIfLine(start,end, boardArray){
    if (!(start[0] == end[0] || start[1] == end[1])){
        return false;
    } else if(start[0] == end[0]){
        let diff = end[1] - start[1]; 
        let dir = diff / Math.abs(diff);
        for (let i = 1; i < Math.abs(diff)+1; i++){
            let coords = [start[0],start[1]+i*dir];
            if (boardArray[coords[0]][coords[1]] !== "Empty")
                return false;
        }
    }
    return true;  
}

export { attemptMovement};