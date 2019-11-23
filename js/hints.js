'use strict'
var elHints = document.querySelector('.hints');
var hintCount = 3
renderHints(hintCount);

function renderHints(num) {
    var strHtml = ``;
    for (var i = 0; i < num; i++) {
        strHtml += `<span onclick="handleHints()">💡</span>`
    }
    elHints.innerHTML = strHtml;

}

function handleHints() {
    var emptyCells = findFreeCells();
    var randomLocation = Math.floor(Math.random() * (emptyCells.length));
    var emptyCell = emptyCells[randomLocation];
    var hintedCell = gBoard[emptyCell.i][emptyCell.j];
    showHint(hintedCell, emptyCell.i, emptyCell.j);
    renderBoard();
}

function findFreeCells() {
    var emptyCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        var row = gBoard[i];

        for (var j = 0; j < row.length; j++) {
            var cell = row[j];
            if (!cell.isMine && !cell.isShown) emptyCells.push({
                i,
                j
            });
        }
    }
    return emptyCells;
}

function showHint(hintedCell, i, j) {
    hintedCell.currHinted = true;  
    showHideNegs(i, j);
    renderBoard();
    hintCount--;
    renderHints(hintCount);
    setTimeout(function () {
        hintedCell.currHinted = false;     
        showHideNegs(i, j);
        renderBoard();
    }, 1000);
}

function showHideNegs(posI, posJ) {
    console.log(posI, posJ);
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            var neg = gBoard[i][j]
            if (neg.isHinted === false) neg.isHinted = true;
            else neg.isHinted = false;


            console.log(neg);
            renderBoard();

        }
    }

}