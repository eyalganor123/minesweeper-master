'use strict'

const BLIP = new Audio('./sounds/blip.wav');
const EXPLOSION = new Audio('./sounds/explosion.wav');
var gMute = true;


function handleMute() {
    if (gMute === false) {
        gMute = true;
        document.querySelector('.speaker').innerHTML = `<img class ="speaker" src="./sounds/speaker.png" alt="Speaker" height="42" width="42" onclick = "handleMute()">`
    } else {
        gMute = false;
        document.querySelector('.speaker').innerHTML = `<img class ="speaker" src="./sounds/mute.png" alt="Speaker" height="42" width="42" onclick = "handleMute()">`
    }
    console.log(123);
}

function play(sound){
    if(!gMute) return;
    sound.play();
}