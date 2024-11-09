const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const video = document.querySelector(".video");
const toggleButton = document.querySelector(".toggleButton");
const progress = document.querySelector(".progress");
const volumeSlider = document.getElementById("volume");
const speed = document.getElementById('speed')
const skipBtns = document.querySelectorAll("[data-skip]");

toggleButton.innerHTML = toggleButton.textContent = '\u{E903}'

function togglePlay() {
  if (video.paused || video.ended) {
    video.play();
  } else {
    video.pause();
  }
}

function updateToggleButton() {
  toggleButton.innerHTML = video.paused ? "\u{E903}" : "\u{E902}";
}

function handleProgress(){
  video.addEventListener('loadedmetadata', () => {progress.max = video.duration;});
}

function handleSliderUpdate() {
  video[this.name] = this.value;
}

function handleSkip() {
  video.currentTime += +this.dataset.skip;
}

toggleButton.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateToggleButton);
video.addEventListener("pause", updateToggleButton);
video.addEventListener("timeupdate", handleProgress);
video.addEventListener('loadedmetadata', () => {progress.max = video.duration;});

volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;

  video.volume = value / 100;
});

speed.addEventListener('input', (e) =>{
  const value = e.target.value;

  video.playbackRate = value;
});

skipBtns.forEach((btn) => {
  btn.addEventListener("click", handleSkip);
});

let mousedown = false;
progress.addEventListener('input', () => {video.currentTime = progress.value;});

volumeSlider.addEventListener('input', (e) => {
  const value = e.target.value;

  video.volume = value / 100;
});

speed.addEventListener('input', (e) =>{
  const value = e.target.value;

  video.playbackRate = value;
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    togglePlay();
    sleep(50);
  }
  if (e.code === "KeyK"){
    togglePlay();
    sleep(50);
  }
});
