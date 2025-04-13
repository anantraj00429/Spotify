console.log("lets write some code");

let currentSong = new Audio();
const play = document.getElementById("play");
const pause = document.getElementById("pause");
const circle = document.querySelector(".circle");
const box = document.querySelector(".box");
const seekbar = document.querySelector(".seekbar");
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = " ";
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      const song = element.href.split(`/${folder}/`)[1]; // Retrieve the song name
      songs.push(song);

      songUL.insertAdjacentHTML(
        "beforeend",
        `<li>
        <i class="fa-solid fa-music music-1"></i>
        <div class="info">
          <div> ${song.replaceAll("%20", " ")}</div>
          <div>Anant Raj</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img class="invert play-1" src="icon/play.svg" alt="play">
        </div>
      </li>`
      );
    }
  }

  Array.from(songUL.getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
  return songs;
}

const playMusic = (track, pause = false) => {
  if (track) {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
      currentSong.play();
      play.src = "icon/pause.svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML =
      "00:00 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; 00:00";
  } else {
    console.error("no track found");
  }
};

async function main() {
  await getSongs("songs/Newsong");
  playMusic(songs[0], true);

  // await getSongs("songs/Jubinnautiyal");
  // playMusic(songs[0], true);

  // await getSongs("songs/Newsong");
  // playMusic(songs[0], true);

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "icon/pause.svg";
    } else {
      currentSong.pause();
      play.src = "icon/play.svg";
    }
  });

  let progress = 0;
  let isSongPlaying = false;
  currentSong.addEventListener("timeupdate", () => {
    progress = (currentSong.currentTime / currentSong.duration) * 100;
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; ${secondsToMinutesSeconds(
      currentSong.duration
    )}`;

    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    circle.style.left = progress + "%";
    if (!currentSong.paused && box.style.display === "none") {
      box.style.display = "block";
    } else {
      isSongPlaying = false;
      box.style.display = "none";
    }
    const circlePosition = (circle.offsetLeft / seekbar.offsetWidth) * 100;
    box.style.width = circlePosition + "%";
    box.style.width = progress + "%";
    seekbar.style.overflow = "visible";
  });

  seekbar.addEventListener("click", (e) => {
    // Calculate the percentage based on click position
    const percent = (e.offsetX / seekbar.offsetWidth) * 100;

    // Set circle and box positions
    circle.style.left = percent + "%";
    box.style.width = percent + "%";

    // Update audio currentTime
    currentSong.currentTime = (currentSong.duration * percent) / 100;

    if (currentSong.currentTime > 0 && box.style.display === "none") {
      box.style.display = "block";
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".bar").addEventListener("click", () => {
    document.querySelector(".left-box").style.left = "0";
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left-box").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    if (currentSong.src && songs) {
      const currentFileName = currentSong.src.split("/").pop(); // Extract the filename
      const index = songs.indexOf(currentFileName);

      if (index - 1 >= 0) {
        playMusic(songs[index - 1]);
      }
    }
  });

  next.addEventListener("click", () => {
    if (currentSong.src && songs) {
      const currentFileName = currentSong.src.split("/").pop(); // Extract the filename
      const index = songs.indexOf(currentFileName);

      if (index + 1 < songs.length) {
        playMusic(songs[index + 1]);
      }
    }
  });

  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  Array.from(document.getElementsByClassName("img")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      const folder = item.currentTarget.dataset.folder;
      if (folder) {
        const newSongs = await getSongs(`songs/${folder}`);
        console.log("newSongs");

        if (newSongs.length > 0) {
          songs = newSongs;
          playMusic(songs[0], true);
        } else {
          console.error("No songs found in the selected folder.");
        }
      }
    });
  });

  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("icon/volume.svg")) {
      e.target.src = e.target.src.replace("icon/volume.svg", "icon/mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("icon/mute.svg", "icon/volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 30;
    }
  });
}

main();
