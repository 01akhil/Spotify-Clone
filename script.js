let currentSong=new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder){

    currFolder=folder;
    let a =await fetch(`/${currFolder}/`)
    let response=await a.text();
    // console.log(response)
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split(`/${currFolder}/`)[1])
        }  
    }
      
    

}

 
const playMusic=(track)=>{
    // let audio=new Audio("/songs/" + track)
    currentSong.src=`/${currFolder}/` + track
    currentSong.play();
    play.src="pause-svgrepo-com.svg"
    document.querySelector(".songinfo").innerHTML=track
   
    document.querySelector(".songtime").innerHTML=""
}



async function main(){

    await getSongs("songs")

    let songUL=document.querySelector(".songslist").getElementsByTagName("ul")[0]
    for(const song of songs){
        songUL.innerHTML=songUL.innerHTML+
        `<li>
                <img class="music" src="music.svg" alt="">
                <div class="info">
                  <div class="songName">${song.replaceAll("%20"," ")}</div>
                  <div class="songArtist">Akhilesh Bhadula</div>
                </div>
                <img class="invert playnow" src="play-button-movie-svgrepo-com.svg" alt="">
              </li>`;
    }

Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
    console.log(e.querySelector(".info").firstElementChild.innerHTML)
    playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    console.log(currentSong);
})
}
)
   

play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="pause-svgrepo-com.svg"
    }

    else{
        currentSong.pause()
        play.src="play-button-movie-svgrepo-com.svg"
    }

})


currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)}:${secondsToMinutesSeconds(currentSong.duration)}`

})

document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
    document.querySelector(".circle").style.left=percent+"%";
    currentSong.currentTime=((currentSong.duration)*percent)/100
})

document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".first").style.left="0";
    
})

document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".first").style.left="-100%";

})

document.querySelector(".backward").addEventListener("click",()=>{
    
    let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index)>=0){
    playMusic(songs[index-1])
}


})

document.querySelector(".forward").addEventListener("click",()=>{
    
let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
if((index+1)>length){
    playMusic(songs[index+1])
}
})

Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
        const folderName = item.currentTarget.dataset.folder;
        console.log(folderName)
        if (folderName) {
            await getSongs(folderName);
            playMusic(songs[0])
        } 
        else {
            console.error("Data attribute 'data-folder' not found on the clicked card.");
        }

        // <div class="songinfo">${song.replaceAll("%20"," ")}</div>

    });
});
        
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("loader").style.display = "none";
  });
        

}





// let accessToken; // Define access token variable

// // Function to obtain access token
// fetch('https://accounts.spotify.com/api/token', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     body: 'grant_type=client_credentials&client_id=56ba9969b3814072ab1491226be80bfa&client_secret=2dce46f5892645658922cccde410b44d'
// })
// .then(response => response.json())
// .then(data => {
//     accessToken = data.access_token; // Store access token
//     console.log(accessToken); // Access token
// })
// .catch(error => {
//     console.error('Error:', error);
// });

// // Initialize Spotify Web Playback SDK once access token is obtained
// window.onSpotifyWebPlaybackSDKReady = () => {
//     const player = new Spotify.Player({
//         name: 'Web Playback SDK Quick Start Player',
//         getOAuthToken: cb => { cb(accessToken); }
//     });

//     // Error handling
//     player.addListener('initialization_error', ({ message }) => { console.error(message); });
//     player.addListener('authentication_error', ({ message }) => { console.error(message); });
//     player.addListener('account_error', ({ message }) => { console.error(message); });
//     player.addListener('playback_error', ({ message }) => { console.error(message); });

//     // Playback status updates
//     player.addListener('player_state_changed', state => { console.log(state); });

//     // Ready
//     player.addListener('ready', ({ device_id }) => {
//         console.log('Ready with Device ID', device_id);
//     });

//     // Connect to the player!
//     player.connect();
// };

// function searchSpotify() {
//     var searchQuery = document.getElementById("searchInput").value;

//     fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent(searchQuery) + '&type=track', {
//         headers: {
//             'Authorization': 'Bearer ' + accessToken
//         }
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         // Handle search results here, update the UI accordingly
//         var resultsDiv = document.getElementById("searchResults");
//         resultsDiv.innerHTML = ''; // Clear previous results
//         data.tracks.items.forEach(item => {
//             var trackDiv = document.createElement("div");
//             trackDiv.textContent = item.name + ' - ' + item.artists[0].name;
//             trackDiv.setAttribute('data-track-uri', item.uri); // Store track URI as a data attribute
//             trackDiv.addEventListener('click', () => playTrack(item.uri)); // Pass track URI to playTrack function
//             resultsDiv.appendChild(trackDiv);
//         });
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// function playTrack(trackUri) {
//     fetch('https://api.spotify.com/v1/me/player/play', {
//         method: 'PUT',
//         headers: {
//             'Authorization': 'Bearer ' + accessToken,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//             uris: [trackUri]
//         }),
//     })
//     .then(response => {
//         if (response.ok) {
//             console.log('Track started');
//         } else {
//             console.error('Error starting track:', response.statusText);
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }































function searchSpotify() {
    var searchQuery = document.getElementById("searchInput").value;
    var accessToken = 'BQCsmiDniG3YDyk160BmNJiJRMLI_lMB6bhrj2O5_HSlQFlZ93H7mcPeWliyZ7Jl3ATUiQzxLM_35xtGu6d479veCsB9CDfA1x91Xgk_SsQaSxEviKY'; 

    fetch('https://api.spotify.com/v1/search?q=' + encodeURIComponent(searchQuery) + '&type=track', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        
        var resultsDiv = document.getElementById("searchResults");
        resultsDiv.innerHTML = ''; 
        data.tracks.items.forEach(item => {
            var trackDiv = document.createElement("div");
            trackDiv.textContent = item.name + ' - ' + item.artists[0].name;
            trackDiv.setAttribute('data-track-uri', item.uri); 
            trackDiv.addEventListener('click', playTrack);
            resultsDiv.appendChild(trackDiv);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function playTrack(event) {
    var trackUri = event.target.getAttribute('data-track-uri');
    var audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = 'https://open.spotify.com/embed/track/' + trackUri;
    audioPlayer.style.display = 'block';
    audioPlayer.play();
}


main()





