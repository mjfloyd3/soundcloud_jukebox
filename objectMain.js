
// SoundCloud API

// Initialize API key
SC.initialize({
  client_id: 'fd4e76fc67798bfa742089ed619084a6',
});

// Defining variables
let player;
var songs = [];
var currentSong = 0;
var dataTitle = "";

var playButton = document.querySelector('.fa-play');
var stopButton = document.querySelector('.fa-stop');
var pauseButton = document.querySelector('.fa-pause');
var forwardButton = document.querySelector('.fa-forward');
var backwardButton = document.querySelector('.fa-backward');
var albumCover = document.querySelector('.albumCover');
var songTitle = document.querySelector('.songTitle');
var playlist = document.querySelector('.playlist');
var playlistSong = document.querySelector('.playlist li');
var playlistTitle = document.querySelector('h1');
var songGenre = document.querySelector('.genre');
var songURL = document.querySelector('.songURL');
var userName = document.querySelector('.user');
var playlistURL = document.querySelector('.playlistURL');
var artistSC = document.querySelector('.artistSC');
var releaseDate = document.querySelector('.releaseDate');


// Jukebox constructor 
function Jukebox(apiKey, dataTitle) {

	this.songs = [];
	this.currentSong = 0;

	// Connect to new Jukebox API
	this.loadPlaylist(apiKey, dataTitle);

	// Play current track
	playButton.addEventListener("click", () => {
		console.log("play track");
		this.play();
	});

	// Pause current track
	pauseButton.addEventListener("click", () => {
		console.log("pause track");
		this.pause();
	});

	// Stop current track
	stopButton.addEventListener("click", () => {
		console.log("stop track");
		this.stop();
	});

	// Play next track
	forwardButton.addEventListener("click", () => {
		console.log("next track", this);
		this.forward();
		console.log(dataTitle);
		this.updateHTML(dataTitle);
	});

	// Play last track
	backwardButton.addEventListener("click", () => {
		console.log("last track");
		this.backward();
		this.updateHTML(dataTitle);
	});

	// Play song selected from playlist 
	playlist.addEventListener("click", (event) => {
		this.currentSong = event.target.getAttribute("data-num");
		this.play();
		this.updateHTML(dataTitle);
	})

		// Convert playlist URL into proper API format
		SC.resolve(playlistURL.value).then((data) => {
		var playlistID = data.id;
		var playlistAPI = 'https://api.soundcloud.com/playlists/' + playlistID + '?client_id=fd4e76fc67798bfa742089ed619084a6';
		console.log(playlistAPI);
		this.dataTitle = data.title;

})

}

// Load SoundCloud playlist into Jukebox
Jukebox.prototype.loadPlaylist = function(apiKey, dataTitle) {
	SC.resolve(apiKey).then((data) => {
		console.log(data);
		this.songs.push( ...data.tracks )
		this.updateHTML(dataTitle);
	});
};


// Play song from Jukebox
Jukebox.prototype.play = function() {
	console.log(this.songs[this.currentSong])

	// If song is already playing
	if( this.songs[this.currentSong].player ) {
		this.songs[this.currentSong].player.play();

	// Play next song when finished
		this.songs[this.currentSong].player.on("finish", () => {
			console.log("song ended (was in list)");
			this.forward();
			this.updateHTML(dataTitle);
		});
	// stream song if not playing
	} else {
		SC.stream(`/tracks/${this.songs[this.currentSong].id}`).then((response) => {
		 this.songs[this.currentSong].player = response;
		 response.play();

		  // Play next song when finished
			response.on("finish", () => {
				console.log("song ended (wasn't on list");
				this.forward();
				this.updateHTML(dataTitle);
			});
		});
	}

}

// Stop song from Jukebox
Jukebox.prototype.stop = function() {
	if( this.songs[this.currentSong].player ) {
		this.songs[this.currentSong].player.pause();
		this.songs[this.currentSong].player.seek(0);
	}
}

// Pause song from Jukebox
Jukebox.prototype.pause = function() {
	this.songs[this.currentSong].player.pause();
}

// Play next song from Jukebox
Jukebox.prototype.forward = function() {

	this.stop();
	if (this.currentSong === this.songs.length-1) {
		this.currentSong = -1; }
	
		this.currentSong += 1;
		this.play();
}

// Play last song from Jukebox
Jukebox.prototype.backward = function() {
	
	this.stop();
	if (this.currentSong === 0) {
		this.currentSong = this.songs.length; }

		this.currentSong -= 1;
		this.play();
}

// Update Jukebox HTML 
Jukebox.prototype.updateHTML = function(dataTitle) {

	// Update song information
	playlistTitle.innerText = dataTitle;
	console.log(dataTitle);
	albumCover.src = this.songs[this.currentSong].artwork_url;
	songTitle.innerText = this.songs[this.currentSong].title;
	userName.innerText = this.songs[this.currentSong].user.username;
	songGenre.innerText = this.songs[this.currentSong].genre;
	releaseDate.innerText = this.songs[this.currentSong].release_year;
	playlistURL.href = this.songs[this.currentSong].permalink_url;
	


	// Update playlist
	var playlistHTML = "";
	for (let i = 0; i < this.songs.length; i++) {
		var songHTML = '<li data-num="' + i +'">' + this.songs[i].title + '</li>';
		playlistHTML += songHTML;
	}
	playlist.innerHTML = playlistHTML;
}

// Make new Jukebox
document.addEventListener("DOMContentLoaded", function() {

	SC.resolve('https://soundcloud.com/mjfloyd/sets/soundcloud-api-playlist').then((data) => {
		console.log(data);
	var playlistID = data.id;
	var playlistAPI = 'https://api.soundcloud.com/playlists/' + playlistID + '?client_id=fd4e76fc67798bfa742089ed619084a6';
	console.log(playlistAPI);
	dataTitle = data.title;

	const myJukebox = new Jukebox(playlistAPI, dataTitle);
	});
});



