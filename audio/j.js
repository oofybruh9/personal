const playIconContainer = document.getElementById('play-icon');
const audioPlayerContainer = document.getElementById('player');
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const muteIconContainer = document.getElementById('mute-icon');
let playState = 'play';
let muteState = 'unmute';
playIconContainer.innerText = playIconContainer.textContent = '\u{E903}';
muteIconContainer.innerText = muteIconContainer.textContent = '\u{E900}'

playIconContainer.addEventListener('click', () => {
    if(playState === 'play') {
        audio.play();
        playState = 'pause';
        playIconContainer.innerText = playIconContainer.textContent = '\u{E902}';
    } else {
        audio.pause();
        playState = 'play';
        playIconContainer.innerText = playIconContainer.textContent = '\u{E903}';
    }
});

muteIconContainer.addEventListener('click', () => {
    if(muteState === 'unmute') {
        audio.muted = true;
        muteState = 'mute';
        muteIconContainer.innerText = muteIconContainer.textContent = '\u{E901}'
    } else {
        audio.muted = false;
        muteState = 'unmute';
        muteIconContainer.innerText = muteIconContainer.textContent = '\u{E900}'
    }
});

const showRangeProgress = (rangeInput) => {
    if(rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

seekSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});
volumeSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});





/* Implementation of the functionality of the audio player */

const audio = document.querySelector('audio');
const durationContainer = document.getElementById('duration');
const currentTimeContainer = document.getElementById('current-time');
const outputContainer = document.getElementById('volume-output');
let raf = null;

const calculateTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
}

const displayDuration = () => {
    durationContainer.textContent = calculateTime(audio.duration);
}

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
}


const whilePlaying = () => {
    seekSlider.value = Math.floor(audio.currentTime);
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);
}

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
} else {
    audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
    });
}

seekSlider.addEventListener('input', () => {
    currentTimeContainer.textContent = calculateTime(seekSlider.value);
    if(!audio.paused) {
    }
});

seekSlider.addEventListener('change', () => {
    audio.currentTime = seekSlider.value;
    if(!audio.paused) {
    }
});

volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;

    outputContainer.textContent = value;
    audio.volume = value / 100;
});




/* Implementation of the Media Session API */
if('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata({
        title: 'Amor',
        artist: 'Timothy Infinite',
        album: 'Terco',
        artwork: [
            { src: './cover.jpeg', sizes: '96x96', type: 'image/jpeg' },
            { src: './cover.jpeg', sizes: '128x128', type: 'image/jpeg' },
            { src: './cover.jpeg', sizes: '192x192', type: 'image/jpeg' },
            { src: './cover.jpeg', sizes: '256x256', type: 'image/jpeg' },
            { src: './cover.jpeg', sizes: '384x384', type: 'image/jpeg' },
            { src: './cover.jpeg', sizes: '512x512', type: 'image/jpeg' }
        ]
    });
    navigator.mediaSession.setActionHandler('play', () => {
        if(playState === 'play') {
            audio.play();
            playState = 'pause';
        } else {
            audio.pause();
            playState = 'play';
        }
    });
    navigator.mediaSession.setActionHandler('pause', () => {
        if(playState === 'play') {
            audio.play();
            playState = 'pause';
        } else {
            audio.pause();
            playState = 'play';
        }
    });
    navigator.mediaSession.setActionHandler('seekbackward', (details) => {
        audio.currentTime = audio.currentTime - (details.seekOffset || 10);
    });
    navigator.mediaSession.setActionHandler('seekforward', (details) => {
        audio.currentTime = audio.currentTime + (details.seekOffset || 10);
    });
    navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (details.fastSeek && 'fastSeek' in audio) {
          audio.fastSeek(details.seekTime);
          return;
        }
        audio.currentTime = details.seekTime;
    });
    navigator.mediaSession.setActionHandler('stop', () => {
        audio.currentTime = 0;
        seekSlider.value = 0;
        audioPlayerContainer.style.setProperty('--seek-before-width', '0%');
        currentTimeContainer.textContent = '0:00';
        if(playState === 'pause') {
            playState = 'play';
        }
    });
}