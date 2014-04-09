// YouTunes Content Script JavaScript Document

//Communication with extension
var port = chrome.runtime.connect({name: "player"});

//Send commands to YouTube player events
var playIdEvent = createEvent();
var playEvent = createEvent();
var pauseEvent = createEvent();
var seekEvent = createEvent();
var muteEvent = createEvent();
var unmuteEvent = createEvent();
var setVolumeEvent = createEvent();
var refreshPropsEvent = createEvent();

playIdEvent.initEvent('playId', true, false);
playEvent.initEvent('play', true, false);
pauseEvent.initEvent('pause', true, false);
seekEvent.initEvent('seek', true, false);
muteEvent.initEvent('mute', true, false);
unmuteEvent.initEvent('unmute', true, false);
setVolumeEvent.initEvent('setVolume', true, false);
refreshPropsEvent.initEvent('refreshProps', true, false);

listenForEvent('onPlayerReady', function() {
	port.postMessage({playerReady: true});
});
listenForEvent('onStateChanged', function() {
	port.postMessage({
		playerStateChanged: true,
		state: parseInt(getData("state")),
		stateString: getData("state-v")
	});
});
listenForEvent('onError', function() {
	port.postMessage({
		playerError: true,
		error: parseInt(getData("error")),
		errorString: getData("error-v")
	});
});
listenForEvent('onProps', function() {
	port.postMessage({
		playerProps: true,
		loaded: parseFloat(getData("loaded")),
		elapsed: parseInt(getData("elapsed")),
		duration: parseInt(getData("length")),
		volume: parseInt(getData("volume")),
		muted: (getData("muted") === "true") ? true : false
	});
});

//Listen for events from the background
port.onMessage.addListener(function (msg) {
	if (msg.play) {
		if (msg.id !== undefined) {
			setData("newVideoId", msg.id);
			dispatchEvent(playIdEvent);
		} else {
			dispatchEvent(playEvent);
		}
	}
	if (msg.pause) {
		dispatchEvent(pauseEvent);
	}
	if (msg.seek) {
		setData("newSeekPosition", msg.position);
		dispatchEvent(seekEvent);
	}
	if (msg.mute) {
		dispatchEvent(muteEvent);
	}
	if (msg.unmute) {
		dispatchEvent(unmuteEvent);
	}
	if (msg.setVolume) {
		setData("newVolume", msg.volume);
		dispatchEvent(setVolumeEvent);
	}
	if (msg.getProps) {
		port.postMessage({
			playerProps: true,
			loaded: parseFloat(getData("loaded")),
			elapsed: parseInt(getData("elapsed")),
			duration: parseInt(getData("length")),
			volume: parseInt(getData("volume")),
			muted: (getData("muted") === "true") ? true : false
		});
	}
});

//Helpers
// Event creator
function createEvent() {
	return document.createEvent('Event');
}
// Dispatch event
function dispatchEvent(event) {
	document.getElementById('events').dispatchEvent(event);
}
// Listen for an event
function listenForEvent(event, listener) {
	document.getElementById("events").addEventListener(event, listener);
}
// Page event data getter
function getData(id) {
	return document.getElementById(id).innerText;
}
// Page event data setter
function setData(id, data) {
	document.getElementById(id).innerText = data;
}
