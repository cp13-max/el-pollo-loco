let canvas;
let world;
let gameStarted = false;
let fullScreen = false;
let keyboard = new Keyboard();
const mediaQueryMatch = window.matchMedia('(orientation: landscape) and (max-width: 600px) and (max-height: 500px)');

function init() {
    canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    setMobileButtons();
    setMusicStatus();
}

function setMusicStatus() {
    let text = localStorage.getItem('isMusicMuted');
    isMusicMute = JSON.parse(text);

    setImageForIcon(
        isMusicMute,
        'play-music-button',
        './img/downloaded/mute-icon.png',
        './img/downloaded/speaker-icon.png'
    );
}

function enterFullScreen() {
    if (!fullScreen) {
        document.getElementById('canvas-container').requestFullscreen();
        fullScreen = true;
    } else {
        document.exitFullscreen();
        fullScreen = false;
    }
}

function restartGame() {
    world.resetGame();
}

function startGame() {
    if (!gameStarted) {
        setLevel1();
        setWorld(canvas, keyboard, level1);
        gameStarted = true;
    }
    removeStartScreen();
    pauseContinueGame();
    setDefaultMusicVolume();
}

function setDefaultMusicVolume() {
    if (!isMusicMute) {
        world.unMuteAllMusic();
    } else world.muteAllMusic();
}

function pauseContinueGame() {
    isGamePaused = !isGamePaused;
    setImageForIcon(
        isGamePaused,
        'start-button',
        './img/downloaded/real-start-btn.png',
        './img/downloaded/real-pause-btn.png'
    );
}

function setWorld(canvas, keyboard, level1) {
    world = new World(canvas, keyboard, level1);
}

function removeStartScreen() {
    document.getElementById('start-screen').style.display = 'none';
}

function loadStartScreen() {
    document.getElementById('start-screen').style.display = 'inline';
    document.getElementById('start-screen').src = './img/9_intro_outro_screens/start/startscreen_1.png'
}

function returnToScreen() {
    if (!gameStarted) {
        return;
    }
    world.resetGame();
    isGamePaused = false;
    pauseContinueGame();
    world.muteAllMusic();
    loadStartScreen();
}

function muteMusic() {
    isMusicMute = !isMusicMute;

    localStorage.setItem('isMusicMuted', isMusicMute);

    setImageForIcon(
        isMusicMute,
        'play-music-button',
        './img/downloaded/mute-icon.png',
        './img/downloaded/speaker-icon.png'
    );
    if (gameStarted) {
        if (isMusicMute) {
            world.muteAllMusic();
        } else {
            world.unMuteAllMusic();
        }
    }
}

function setImageForIcon(condition, iconId, img1, img2) {
    if (condition) {
        document.getElementById(iconId).src = img1;
    } else {
        document.getElementById(iconId).src = img2;
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code == 'KeyF') {
        keyboard.F = true;
    }
    if (e.code == 'KeyH') {
        isGamePaused = !isGamePaused;
    }
    if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
        keyboard.LEFT = true;
    }
    if (e.code == 'KeyD' || e.code == 'ArrowRight') {
        keyboard.RIGHT = true;
    }
    if (e.code == 'KeyW' || e.code == 'ArrowUp') {
        keyboard.UP = true;
    }
    if (e.code == 'KeyS' || e.code == 'ArrowDown') {
        keyboard.DOWN = true;
    }
    if (e.code == 'Space') {
        keyboard.SPACE = true;
    }
    if (e.code == 'KeyN') {
        keyboard.N = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code == 'KeyA' || e.code == 'ArrowLeft') {
        keyboard.LEFT = false;
    }
    if (e.code == 'KeyD' || e.code == 'ArrowRight') {
        keyboard.RIGHT = false;
    }
    if (e.code == 'KeyW' || e.code == 'ArrowUp') {
        keyboard.UP = false;
    }
    if (e.code == 'KeyS' || e.code == 'ArrowDown') {
        keyboard.DOWN = false;
    }
    if (e.code == 'Space') {
        keyboard.SPACE = false;
    }
    if (e.code == 'KeyF') {
        keyboard.F = false;
    }
    if (e.code == 'KeyH') {
        keyboard.H = false;
    }
    if (e.code == 'KeyN') {
        keyboard.N = false;
    }
});

function setMobileButtons() {
    let mobileLeft = document.getElementById('btn-mobile-left');
    let mobileRight = document.getElementById('btn-mobile-right');
    let mobileJump = document.getElementById('btn-mobile-jump');
    let mobileThrow = document.getElementById('btn-mobile-throw');

    setMobileButtonEvents(mobileLeft, 'LEFT');
    setMobileButtonEvents(mobileRight, 'RIGHT');
    setMobileButtonEvents(mobileJump, 'SPACE');
    setMobileButtonEvents(mobileThrow, 'F');
}

function setMobileButtonEvents(button, key) {
    button.addEventListener('touchstart', (e) => {
        e.preventDefault();
        keyboard[key] = true;
    });

    button.addEventListener('touchend', (e) => {
        e.preventDefault();
        keyboard[key] = false;
    });
}
