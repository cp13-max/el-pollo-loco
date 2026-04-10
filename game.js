const scripts = [
    './models/drawable-objects.class.js',
    './models/movable-object.class.js',
    './models/status-bar.class.js',
    './models/health-status.class.js',
    './models/bottle-status.class.js',
    './models/coin-status.class.js',
    './models/hero.class.js',
    './models/chicken.class.js',
    './models/small-chicken.class.js',
    './models/endboss.class.js',
    './models/boss-health-status.class.js',
    './models/cloud.class.js',
    './models/background-object.class.js',
    './models/bottles.class.js',
    './models/coins.class.js',
    './models/throwable-bottle.class.js',
    './models/keyboard.class.js',
    './models/level.class.js',
    './levels/level1.js',
    './js/world-support.js',
    './models/world.class.js',
];

let canvas;
let world;
let keyboard;

const mediaQueryMatch = window.matchMedia('(orientation: landscape) and (max-width: 600px) and (max-height: 500px)');

/**
 * creates a script and adds it to head
 * @param {string} src src of the script
 * @returns
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;

        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Fehler beim Laden von ${src}`));

        document.head.appendChild(script);
    });
}

/**
 * creates mutiple scripts and load them in order
 */
async function loadAllScripts() {
    for (let index = 0; index < scripts.length; index++) {
        const src = scripts[index];
        await loadScript(src);
    }
    keyboard = new Keyboard();
}

/**
 * shows load animation while all scripts are created/loaded
 */
async function loadGame() {
    ToggleLoadingScreen();
    await loadAllScripts();
    ToggleLoadingScreen();
}

/**
 * toggles load screen/animation on/off
 */
function ToggleLoadingScreen() {
    document.getElementById('loading-screen').classList.toggle('d-none');
}

function toggleMobileBar() {
    if (matchMedia('(pointer:coarse)').matches) {
        document.getElementById('mobile-bar').classList.toggle('d-flex');
        console.log('toggled');
        
    }
}

/**
 * function is called upon loading the page
 * sets canvas, buttons for mobile and music
 */
function init() {
    loadGame();
    canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    setMobileButtons();
    setMusicStatus();
}

/**
 * gets music status (mute or not) from local storage
 */
function setMusicStatus() {
    let text = localStorage.getItem('musicIsmuted');
    musicIsmute = JSON.parse(text);

    setImageForIcon(
        musicIsmute,
        'play-music-button',
        './img/downloaded/mute-icon.png',
        './img/downloaded/speaker-icon.png',
    );
}

/**
 * canvas(game) is set to full screen
 */
function enterFullScreen() {
    if (!fullScreen) {
        document.getElementById('canvas-container').requestFullscreen();
        fullScreen = true;
    } else {
        document.exitFullscreen();
        fullScreen = false;
    }
}

/**
 * restarts entire game
 */
function restartGame() {
    world.resetGame();
}

/**
 * loads and starts the game.
 * if game has begun it pauses/unpauses game
 */
function startGame() {
    if (!gameHasStarted) {
        setLevel1();
        setWorld(canvas, keyboard, level1);
        
        gameHasStarted = true;
    }
    pauseContinueGame();
    setDefaultMusicVolume();
    if (!gameIsOver) {
        removeStartScreen();
    }
}

/**
 * sets the volume of all music to default status
 */
function setDefaultMusicVolume() {
    if (!musicIsmute) {
        unMuteAllMusic(world);
    } else muteAllMusic(world);
}

/**
 * pauses/unpauses game
 */
function pauseContinueGame() {
    gameIsPaused = !gameIsPaused;
    setImageForIcon(
        gameIsPaused,
        'start-button',
        './img/downloaded/real-start-btn.png',
        './img/downloaded/real-pause-btn.png',
    );
}

/**
 * creates a new game
 * @param {object} canvas
 * @param {object} keyboard
 * @param {object} level1
 */
function setWorld(canvas, keyboard, level1) {
    world = new World(canvas, keyboard, level1);
}

/**
 * removes the start screen when game begins
 */
function removeStartScreen() {
    toggleMobileBar();
    document.getElementById('start-screen').style.display = 'none';
}

/**
 * load start screen
 */
function loadStartScreen() {
    toggleMobileBar();
    document.getElementById('start-screen').style.display = 'inline';
    document.getElementById('start-screen').src = './img/9_intro_outro_screens/start/startscreen_1.png';
    document.getElementById('restart-return').style.display = 'none';
}

/**
 * ends game and return to start screen
 * @returns
 */
function returnToScreen() {
    if (!gameHasStarted) {
        return;
    }
    world.resetGame();
    gameIsPaused = false;
    pauseContinueGame();
    muteAllMusic(world);
    loadStartScreen();
}

/**
 * mutes/unmutes all music and saves music status in local storage
 */
function muteMusic() {
    musicIsmute = !musicIsmute;
    localStorage.setItem('musicIsmuted', musicIsmute);

    setImageForIcon(
        musicIsmute,
        'play-music-button',
        './img/downloaded/mute-icon.png',
        './img/downloaded/speaker-icon.png',
    );

    if (gameHasStarted) {
        if (musicIsmute) {
            muteAllMusic(world);
        } else {
            unMuteAllMusic(world);
        }
    }
}

/**
 * changes the image of the play/pause and mute/unmute buttons
 * @param {boolean} condition
 * @param {string} iconId
 * @param {string} img1
 * @param {string} img2
 */
function setImageForIcon(condition, iconId, img1, img2) {
    if (condition) {
        document.getElementById(iconId).src = img1;
    } else {
        document.getElementById(iconId).src = img2;
    }
}

/**
 * checks if certain buttons are pressed
 */
window.addEventListener('keydown', (e) => {
    if (e.code == 'KeyF') {
        keyboard.F = true;
    }
    if (e.code == 'KeyH') {
        gameIsPaused = !gameIsPaused;
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

/**
 * checks if certain buttons are no longer pressed
 */
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

/**
 * creates on screen buttons which replaces keyboard buttons on mobile devices
 */
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

/**
 * checks if mobile buttons are touched/no longer touched
 * @param {object} button
 * @param {string} key
 */
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

function showControls() {
    document.getElementById('control-arrow').classList.toggle('rotate-arrow');
    document.getElementById('controls').classList.toggle('d-flex');
}
