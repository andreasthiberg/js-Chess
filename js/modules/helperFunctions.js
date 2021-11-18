/* Finds the (two-deep) index of a piece in the board array: Example return: [2][5] */
function findPieceIndex(piece,boardArray){
    let foundIndex = -1;
    for (let i = 0; i < boardArray.length; i++){
        foundIndex = boardArray[i].indexOf(piece);
        if (foundIndex != -1){
            return [i,foundIndex];
        }
    }
    return "Index not found";
}

/* Compares two coordinate-arrays such as [0,2] and [0,1] */
function compareCoords (a,b){
    if (a.length !== b.length){
        return false;
    }
    for(let i = 0;i < a.length; i++){
        if(a[i] !== b[i]){
            return false;
        }
    }
    return true;
}

/* Returns a copy of the board for stopping moves when checked*/
function copyBoard (boardArray){
    let copy = [];
    for (let i = 0; i < boardArray.length; i++){
        copy.push([...boardArray[i]]);
    }
    return copy;
}

export {findPieceIndex,compareCoords,copyBoard};