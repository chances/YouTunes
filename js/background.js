// YouTunes background.html JavaScript Document

var bridge = new Bridge(),
    player = null,
    playerPort = null,
    search = null,
    playlists = new PlaylistCollection();

$(function () {
	player = new Player();
});

//TODO: Implement a simple settings class (maybe?)

chrome.storage.local.get(function (result) {
    search = new Search(result.search);
    if (result.playlists) {
        var playlist = null;
        for (var i in result.playlists) {
            playlist = new Playlist(result.playlists[i].name, result.playlists[i].isInternal, result.playlists[i].isQueue);
            playlist.add(result.playlists[i].tracks);
            playlists.add(playlist);
        }
    } else {
        var queue = new Playlist('Queue', true, true);
        playlists.add(queue);
    }
});

//Events sent from the popup
bridge.on('getProps', function (event) {
	if (playerPort) {
		playerPort.postMessage({getProps: true});
	}
});

//Messages sent from the YouTube player
chrome.runtime.onConnect.addListener(function(port) {
	if (port.name === "player") {
		playerPort = port;
		port.onMessage.addListener(function(msg) {
			if (msg.playerReady) {
				player.isReady = true;
                player.status = PlayerStatus.BUFFERING;
				bridge.trigger('playerReady');
			}
			if (msg.playerStateChanged) {
				player.state = msg.state;
				player.error = null;

                // Advance current track in playlist if needed
                //  or loop if looping
                if (player.state === PlayerState.ENDED) {
                    if (player.currentPlaylist !== null) {
                        var track = player.currentPlaylist.getNextTrack(player.isLoopingPlaylist);
                        if (player.currentPlaylist.isQueue) {
                            playlists.save();
                        }
                        if (track !== null) {
                            player.play(track);
                        } else {
                            player.currentPlaylist = null;
                        }
                    } else {
                        if (player.isLooping) {
                            player.play();
                        }
                    }
                }

                bridge.trigger('playerStateChanged', {state: msg.stateString});
			}
			if (msg.playerError) {
				player.error = msg.error;
				bridge.trigger('playerError', {error: msg.error});
			}
			if (msg.playerProps) {
				player.loaded = msg.loaded;
				player.elapsed = msg.elapsed;
				player.duration = msg.duration;
				player.volume = msg.volume;
				player.muted = msg.muted;
                player.preparing = false;
				bridge.trigger('playerProps');
			}
		});
	}
});
