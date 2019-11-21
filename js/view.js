'use strict'

var elModal = document.querySelector('.modal');

function handleModal() {

    if (gGame.isModalOn === false) {
        elModal.style.display = 'block';
        gGame.isModalOn = true;
    } else {
        elModal.style.display = 'none';
        gGame.isModalOn = false;
    }
}