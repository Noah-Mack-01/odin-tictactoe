/*
 * tile constructor 
 */
const TileFactory = (x,y)=> {
    let curOwner = "";
    let button = document.querySelector(`.tile[data-x="${x}"][data-y="${y}"]`);
    // switches owner of tile if it hasn't been filled out yet.
    const switchOwner = owner2 => {
        if (curOwner == "") {
            curOwner = owner2;
            button.innerHTML = owner2;
            return true;
        }
        return false;
    }

    const getOwner = () => {return curOwner}

    return {switchOwner, getOwner, x, y, button}
}

const winningMap = new Map();
winningMap.set(`[1, 1]`, [[[2,1],[3,1]],[[1,2],[1,3]],[[2,2],[3,3]]]);
winningMap.set(`[1, 2]`, [[[1,1],[1,3]],[[2,2],[3,2]]]);
winningMap.set(`[1, 3]`, [[[2,1],[1,1]], [[2,3],[3,3]], [[2,2],[3,1]]]);
winningMap.set(`[2, 1]`,[[[1,1],[3,1]],[[2,2],[2,3]]]);
winningMap.set(`[2, 2]`, [[[1,1],[3,3]],[[3,1],[1,3]],[[2,1],[2,3]],[[1,2],[3,2]]]);
winningMap.set(`[3, 1]`, [[[2,1],[1,1]],[[3,2],[3,3]],[[2,2],[1,3]]]);
winningMap.set(`[3, 2]`, [[[1,2],[2,2]],[[3,1],[3,3]]]);
winningMap.set(`[3, 3]`, [[[1,3],[2,3]],[[3,1],[3,2]],[[2,2],[1,1]]]);
winningMap.set(`[2, 3]`,[[[1,3],[3,3]],[[2,2],[2,1]]]);




const BoardFactory = (()=> {
    let player_turn = "X";
    let turnCount = 0;
    let board = new Map();
    for (let i = 1; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            board.set(`[${i}, ${j}]`, TileFactory(i,j));
        }
    }

    const flipTile = (x,y)=> {
        let temp = board.get(`[${x}, ${y}]`);
        if (!temp.switchOwner(player_turn)) return;
        turnCount++;
        if (isGameOver(temp)) { gameOver(player_turn) };
        (player_turn == "X") ? player_turn = "O" : player_turn = "X";
    };

    const gameOver = (owner)=>{
        document.getElementById("winner-statement").innerHTML = `${owner} wins!`
        document.getElementById("board").innerHTML="";
        document.getElementById("board").classList.remove("holder");
    }

    const isGameOver = (lastTile)=> {
        if (turnCount >= 9) return true;
        console.log("X: " +lastTile.x + " Y: " + lastTile.y)
        let potentialAvenues = winningMap.get(`[${lastTile.x}, ${lastTile.y}]`);
        return potentialAvenues.some((avenue) => goodPath(avenue, player_turn));
    }

    

    const goodPath = (path, owner) => {
        //if every tile in the path has the same owner, return true.

        return path.every((coords) => board.get(`[${coords[0]}, ${coords[1]}]`).getOwner() == owner);

    }
    return {flipTile};

})();


document.querySelectorAll("button.tile").forEach(button=>{
    button.addEventListener("click", event=>{
        let x = event.target.dataset.x, y = event.target.dataset.y;
        BoardFactory.flipTile(x,y);
    })
})

