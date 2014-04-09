<!DOCTYPE html>
<html>
    <body>
    	<script>

var yTunesClient = null;
var ytplayer = null;

var stateChangedEvent = document.createEvent('Event');
var errorEvent = document.createEvent('Event');

stateChangedEvent.initEvent('onStateChanged', true, false);
errorEvent.initEvent('onError', true, false);

function getData(id) {
	return document.getElementById(id).innerText;
}
function setData(id, data) {
	document.getElementById(id).innerText = data;
}
function listenForEvent(event, listener) {
	document.getElementById("events").addEventListener(event, listener);
}
function dispatchEvent(event) {
	document.getElementById("events").dispatchEvent(event);
}

listenForEvent("play", function() {
	play();
});
listenForEvent("pause", function() {
	pause();
});
listenForEvent("loadVideo", function() {
	playID();
});
listenForEvent("refreshProps", function() {
	refreshProps();
});

function onYouTubePlayerReady(playerId) {
	ytplayer = document.getElementById("myytplayer");
	ytplayer.addEventListener("onStateChange", "onYtStateChanged");
	ytplayer.addEventListener("onError", "onYtError");
}

function playID() {
	if (ytplayer) { ytplayer.loadVideoById(getData("newVideoID")); }
}
function play() {
	if (ytplayer) { ytplayer.playVideo(); }
}
function pause() {
	if (ytplayer) { ytplayer.pauseVideo(); }
}
function refreshProps() {
	if (ytplayer) {
		setData("bytesLoaded", ytplayer.getVideoBytesLoaded());
		setData("bytesTotal", ytplayer.getVideoBytesTotal());
		setData("elapsed", ytplayer.getCurrentTime());
	}
}

function onYtStateChanged(newState) {
	//Get the state type
	var type = null;
	if (newState == -1) { type = 'unstarted'; }
	if (newState == 0) { type = 'ended'; }
	if (newState == 1) { type = 'playing'; }
	if (newState == 2) { type = 'paused'; }
	if (newState == 3) { type = 'buffering'; }
	if (newState == 5) { type = 'cued'; }
	setData("state", newState);
	setData("state-v", type);
	dispatchEvent(stateChangedEvent);
}

function onYtError(error) {
	//Get the error type
	var type = null;
	if (error == 100) { type = 'unavailable'; }
	if (error == 101) { type = 'noEmbed'; }
	if (error == 150) { type = 'noEmbed'; }
	setData("error", error);
	setData("error-v", type);
	dispatchEvent(errorEvent);
}

		</script>
        <object type="application/x-shockwave-flash" id="myytplayer"
          data="http://www.youtube.com/v/<?php echo $_GET["id"]; ?>?autoplay=<?php echo ($_GET["autoplay"]=="1") ? "1" : "0"; ?>&enablejsapi=1&playerapiid=ytplayer"
          width="100" height="40">
        	<param name="allowScriptAccess" value="always">
        </object>
        <div id="events">
            State: <span id="state"></span> - <span id="state-v"></span>
            <br/>
            Error: <span id="error">0</span> - <span id="error-v">none</span>
            <br/>
            Buffer: Loaded <span id="bytesLoaded">0</span> of <span id="bytesTotal">0</span> bytes.
            <br/>
            Playback: <span id="elapsed">0</span> ms elapsed.
            <br/>
            <span id="newSeekPosition" style="display: none;"></span>
            <span id="newVideoID" style="display: none;"></span>
        </div>
    </body>
</html>
