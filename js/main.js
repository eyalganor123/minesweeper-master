'use strict'

var gBoard = [];
var gGame = {
    isGameOn: false,
    pointCounter: 0,
    isModalOn: false,
    bombsForLevel: 0,
    level: ""
}
var gInterval;
var gTimer = 0;
const BOMB = '💣';
const FLAG = '🚩'

var elCounter = document.querySelector('.counter');
var elTimer = document.querySelector('.timer');

document.oncontextmenu = function () {
    return false;
}

function initGame(num, bombs, event) {
    gGame.level = event.target.innerText;
    hintCount = 3;
    resetGame();
    renderHints(hintCount);
    gGame.bombsForLevel = bombs;
    gBoard = createBoard(num);
    document.querySelector('.smiley').innerText = '😊';
    renderBoard();
}

function resetGame() {
    clearInterval(gInterval);
    gGame.pointCounter = 0;
    elTimer.innerText = '0';
    handleModal();
}

function startTimer() {
    play(BLIP);
    elTimer.innerText = gTimer;
    gTimer++;
}

function createBoard(num) {
    var board = []
    for (var i = 0; i < num; i++) {
        board[i] = [];
        for (var j = 0; j < num; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isHinted: false,
            };
        }
    }
    return board
}

function renderBoard() {
    var content = ``;
    var strHtml = ``;
    var view = "hidden";

    for (var i = 0; i < gBoard.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];

            if (cell.isShown === true) {
                view = 'shown'
            } else {
                view = 'hidden'
            }

            if (cell.isMine === true && cell.isShown === true) {
                content = BOMB;
            } else {
                if (cell.isShown === false || cell.minesAroundCount === 0) content = "";
                else {
                    content = cell.minesAroundCount;
                }
            }
            if (cell.isMarked === true) {
                view = 'hidden';
                content = FLAG;
            }
            if (cell.isHinted === true) {
                view = 'hinted';
                if (cell.minesAroundCount === 0) content = ""
                else content = cell.minesAroundCount;

            }
            if (gGame.level === "BEGINNER") view += ' bigCell';
            if (gGame.level === "MEDIUM") view += ' mediumCell';
            if (gGame.level === "EXPERT") view += ' smallCell';

            strHtml += `<td onclick="cellClicked(this,${i},${j},event)" class= '${view}'
            oncontextmenu="javascript:handleFlag(${i},${j});">${content}</td>`

        }
        strHtml += `</tr>`

    }
    var board = document.querySelector('.board')
    board.innerHTML = strHtml;
    elCounter.innerText = gGame.pointCounter;
}

function cellClicked(that, i, j) {
    var currCell = gBoard[i][j];
    if (currCell.isMarked === true || currCell.isShown === true) return;
    if (gGame.pointCounter === 0) {
        handleFirstClick(i, j);
    }

    if (currCell.isMarked === true) {

        return;
    }

    if (currCell.isMine === true) {
        gameOver('dead');
    }
    currCell.isShown = true;
    gGame.pointCounter++;
    extendReveal(i, j);

    checkForWin(i, j);
    renderBoard();
    // console.log(that);Î
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            cell.minesAroundCount = countNegs(i, j);
        }
    }
    return gBoard;
}

function countNegs(posI, posJ) {
    var negsCount = [];

    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === posI && j === posJ) continue;

            if (gBoard[i][j].isMine === false) continue;
            negsCount.push({
                i,
                j
            });
        }
    }

    return negsCount.length;
}

function gameOver(status) {
    if (status === 'dead') {
        showAllBombs();
        document.querySelector('.smiley').innerText = '😞';
        document.querySelector('.winLoose').innerText = '💀';
        play(EXPLOSION);
        clearInterval(gInterval);
        gInterval = null;
        setTimeout(function () {
            document.querySelector('.winLoose').innerText = '';
            gGame.isGameOn = false;
            console.log('game over', status);

            resetGame();

        }, 4000);

    } else if (status === 'win') {
        document.querySelector('.smiley').innerText = '🤩';
        document.querySelector('.winLoose').innerText = '🏆';
        play(WIN);
        clearInterval(gInterval);
        gInterval = null;
        setTimeout(function () {
            document.querySelector('.winLoose').innerText = '';
            gGame.isGameOn = false;

            resetGame();
        }, 3000);
    }
};

function showAllBombs() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine === true) cell.isShown = true;
        }
        renderBoard();
    }

}

function placeRandomBombs(i, j, bombs) {

    for (var index = 0; index < bombs; index++) {
        var numI = Math.floor(Math.random() * gBoard.length);
        var numJ = Math.floor(Math.random() * gBoard.length);
        while (numI === i && numJ === j) {
            numI = Math.floor(Math.random() * gBoard.length);
            numJ = Math.floor(Math.random() * gBoard.length);
        }
        gBoard[numI][numJ].isMine = true;
    }
}

function handleFirstClick(i, j) {
    gBoard[i][j].isShown = true;
    renderBoard();
    gGame.isGameOn = true;
    gTimer = 1;
    gInterval = setInterval(startTimer, 1000);
    placeRandomBombs(i, j, gGame.bombsForLevel);
    setMinesNegsCount();
    extendReveal(i, j);
}

function extendReveal(posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            if (i === posI && j === posJ) continue;

            if (gBoard[i][j].isMine === true) continue;
            gBoard[i][j].isShown = true;
        }
    }
}

function handleFlag(i, j) {
    if (gBoard[i][j].isShown === true) return;
    if (gBoard[i][j].isMarked === false) {

        gBoard[i][j].isMarked = true;
        event.target.innerHTML = `<div>${FLAG}</div>`

    } else {
        gBoard[i][j].isMarked = false;
        event.target.innerHTML = `<div></div>`
    }
}

function checkForWin(i, j) {
    var check = 0;
    var bombs = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cell = gBoard[i][j];
            if ((cell.isShown === false && cell.isMine === true))
                bombs++;
            if (cell.isShown === true && cell.isMine === false)
                check++

            if (check + bombs === (gBoard.length ** 2)) gameOver('win');

        }

    }
}