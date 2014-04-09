// YouTunes Player Object JavaScript Document

function Player() {
	this.isReady = false;
	this.state = null;
	this.error = null;
	this.preparing = false;
	this.loaded = 0.0;
	this.elapsed = 0;
	this.duration = 0;
	this.volume = 100;
	this.muted = false;
	this.currentTrack = null;
    this.currentPlaylist = null;
    this.isLooping = false;
    this.isLoopingPlaylist = false;

	var playerElem = $('#player')[0];

	this.play = function (track) {
		track = (track === undefined) ? null : track;

		if (this.isReady) {
			if (track === null) {
				if (playerPort) {
                    if (this.state !== PlayerState.ENDED) {
                        playerPort.postMessage({play: true});
                    } else {
                        if (this.currentPlaylist === null && this.currentTrack !== null) {
                            playerPort.postMessage({play: true, id: this.currentTrack.id});
                        } else {
                            this.currentTrack = this.currentPlaylist.peekNextTrack(this.isLoopingPlaylist);
                            if (this.currentTrack !== null) {
                                playerPort.postMessage({play: true, id: this.currentTrack.id});
                            }
                        }
                    }
                }
			} else {
				this.currentTrack = track;
				this.loaded = 0.0;
				this.elapsed = 0;
				if (playerPort) { playerPort.postMessage({play: true, id: track.id}); }
			}
		} else {
			if (track !== null) {
				this.currentTrack = track;
				this.loaded = 0.0;
				this.elapsed = 0;
				playerElem.src = "http://web.cecs.pdx.edu/~chances/YouTunes/video.php?id=" + track.id + "&autoplay=1";
			}
		}
	};
    this.playPlaylist = function (playlist) {
        this.currentPlaylist = playlist;
        this.play(this.currentPlaylist.peekNextTrack(this.isLoopingPlaylist));
    };
	this.isPlaying = function () {
		return (this.isReady && this.state === PlayerState.PLAYING)? true : false;
	};
	this.pause = function () {
		if (this.isReady) {
			if (playerPort) { playerPort.postMessage({pause: true}); }
		}
	};
	this.seek = function (newPosition) {
		if (this.isReady) {
			if (playerPort) { playerPort.postMessage({seek: true, position: newPosition}); }
		}
	};
	this.mute = function () {
		if (this.isReady) {
			if (playerPort) { playerPort.postMessage({mute: true}); }
		}
	};
	this.unmute = function () {
		if (this.isReady) {
			if (playerPort) { playerPort.postMessage({unmute: true}); }
		}
	};
	this.setVolume = function (newVolume) {
		if (this.isReady) {
			if (playerPort) { playerPort.postMessage({setVolume: true, volume: newVolume}); }
		}
	};
}
