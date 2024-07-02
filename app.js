let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let player1Name = document.getElementById("player1").value || "Player 1";
let player2Name = document.getElementById("player2").value || "Player 2";
let player1Score = 0;
let player2Score = 0;

const player1ScoreDisplay = document.getElementById("player1-score");
const player2ScoreDisplay = document.getElementById("player2-score");

//update player names
document.getElementById("player1").addEventListener("change", () => {
    player1Name = document.getElementById("player1").value || "Player 1";
});

document.getElementById("player2").addEventListener("change", () => {
    player2Name = document.getElementById("player2").value || "Player 2";
});

const updateScoreDisplay = () => {
    player1ScoreDisplay.textContent = `${player1Name}: ${player1Score}`;
    player2ScoreDisplay.textContent = `${player2Name}: ${player2Score}`;
};

const resetScore = () => {
    player1Score = 0;
    player2Score = 0;
    updateScoreDisplay();
};

let turnO = true; //PlayerX and Player 0
let count = 0; //To Track draw conditions

const winPatterns = [
    [0,1,2],
    [0,3,6], 
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],   
    [3,4,5],
    [6,7,8],
];

const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    resetScore();
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if(turnO){ //Player O
            box.innerText = "O";
            box.style.color = "#E178C5";
            turnO = false;
        }else{
            box.innerText = "X";
            box.style.color = "#C65BCF";
            turnO = true;
        }
        box.disabled = true;
        count++;

        let isWinner = checkWinner();
        if (count === 9 && !isWinner) {
            gameDraw();
        }
    });
});

const gameDraw = () => {
    msg.innerText = `Game was a Draw.`;
    msgContainer.classList.remove("hide");
    disableBoxes();
};

const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
    }
};

const showWinner = (winnner) => {
    if(winnner === 'X'){
        player1Score++;
    } else if(winnner === 'O') {
        player2Score++;
    }
    updateScoreDisplay();
    disableBoxes();
    msg.innerText = `Congratulations, ${winnner === 'X' ? player1Name : player2Name} wins!`;
    msgContainer.classList.remove("hide");    
};

const checkWinner = () =>{
    for(let pattern of winPatterns){
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        // if(pos1val != "" && pos2val != "" && pos3val != ""){
        //     if(pos1val === pos2val && pos2val === pos3val){
        //         showWinner(pos1val);
        //         return true;
        //     }
        // }
        if (pos1val !== "" && pos1val === pos2val && pos2val === pos3val) {
            showWinner(pos1val);
            return true;
        }
    }
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

const minimax = (board, depth, maximizingPlayer) => {
    // Base cases: check for terminal states (win, loss, draw)

    // If the current player is the AI (maximizingPlayer)
    if (maximizingPlayer) {
        let bestScore = -Infinity;
        for (let move of emptyCells(board)) {
            board[move] = 'O';
            let score = minimax(board, depth + 1, false);
            board[move] = '';
            bestScore = Math.max(score, bestScore);
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let move of emptyCells(board)) {
            board[move] = 'X';
            let score = minimax(board, depth + 1, true);
            board[move] = '';
            bestScore = Math.min(score, bestScore);
        }
        return bestScore;
    }
};

const emptyCells = (board) => {
    let empty = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            empty.push(i);
        }
    }
    return empty;
};

