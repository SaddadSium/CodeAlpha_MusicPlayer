const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const volumeSlider = document.getElementById("volume-slider");
const playlistList = document.getElementById("playlist-list");

const songs = [
  {
    displayName: "Midnight City",
    artist: "Urban Echo",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    displayName: "Ocean Breeze",
    artist: "Nature Tones",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    displayName: "Desert Rose",
    artist: "Nomad",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    displayName: "Electric Dreams",
    artist: "Synthwave",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    displayName: "Mountain Echo",
    artist: "Wilderness",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  },
];

let isPlaying = false;
let songIndex = 0;

function initPlaylist() {
  playlistList.innerHTML = "";
  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.classList.add("playlist-item");
    if (index === songIndex) li.classList.add("active");
    li.innerHTML = `<span>${song.displayName}</span> <small>${song.artist}</small>`;
    li.onclick = () => {
      songIndex = index;
      loadSong(songs[songIndex]);
      playSong();
    };
    playlistList.appendChild(li);
  });
}

function loadSong(song) {
  title.innerText = song.displayName;
  artist.innerText = song.artist;
  audio.src = song.url;
  document.querySelectorAll(".playlist-item").forEach((item, idx) => {
    item.classList.toggle("active", idx === songIndex);
  });
}

function togglePlay() {
  isPlaying ? pauseSong() : playSong();
}

function playSong() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  audio.play();
}

function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  audio.pause();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function updateProgressBar(e) {
  if (isPlaying) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Time Formatting
    const formatTime = (time) => {
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      return `${min}:${sec < 10 ? "0" : ""}${sec}`;
    };

    if (duration) durationEl.innerText = formatTime(duration);
    currentTimeEl.innerText = formatTime(currentTime);
  }
}

function setProgressBar(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  audio.currentTime = (clickX / width) * audio.duration;
}

// Event Listeners
playBtn.onclick = togglePlay;
prevBtn.onclick = prevSong;
nextBtn.onclick = nextSong;
audio.ontimeupdate = updateProgressBar;

// Autoplay Bonus Item
audio.onended = nextSong;
progressContainer.onclick = setProgressBar;
volumeSlider.oninput = (e) => (audio.volume = e.target.value);

initPlaylist();
loadSong(songs[songIndex]);
