// YouTunes Playlist Object Playlist.js JavaScript Document

function Playlist(name, isInternal, isQueue) {

	this.tracks = [];

    this.id = Date.now();
	this.name = name;
    this.isInternal = (isInternal === undefined) ? false : isInternal;
    this.isQueue = (isQueue === undefined) ? false : isQueue;
    this.currentIndex = -1;
	this.length = 0;
}

Playlist.prototype.add = function (trackOrTracks) {
    if (Array.isArray(trackOrTracks)) {
        var track = null;
        for (var i in trackOrTracks) {
            track = (trackOrTracks[i] instanceof Track) ? track : new Track(trackOrTracks[i]);
            this.tracks.push(track);
        }
        this.length += trackOrTracks.length;
    } else {
        this.tracks.push(trackOrTracks);
        this.length += 1;
    }
};
Playlist.prototype.enqueue = Playlist.prototype.add;
Playlist.prototype.get = function (index) {
    return (index > -1 && index < this.tracks.length) ? this.tracks[index] : null;
};
Playlist.prototype.getPreviousTrack = function (loop) {
    if (this.isQueue) {
        return null;
    } else {
        this.currentIndex = (this.currentIndex === 0) ? ((loop === true) ? this.length - 1 : -1) : this.currentIndex--;
        return this.get(this.currentIndex);
    }
};
Playlist.prototype.peekPreviousTrack = function (loop) {
    if (this.isQueue) {
        return null;
    } else {
        var index = this.currentIndex;
        index = (index === 0) ? ((loop === true) ? this.length - 1 : -1) : index--;
        return this.get(index);
    }
};
Playlist.prototype.getNextTrack = function (loop) {
    if (this.isQueue) {
        this.dequeue();
        return this.peekNextTrack(loop);
    } else {
        this.currentIndex = (this.currentIndex === this.length - 1) ? (loop === true) ? 0 : -1 : this.currentIndex++;
        return this.get(this.currentIndex);
    }
};
Playlist.prototype.peekNextTrack = function (loop) {
    if (this.isQueue) {
        return this.get(0);
    } else {
        var index = this.currentIndex;
        index = (index === this.length - 1) ? (loop === true) ? 0 : -1 : index++;
        return this.get(index);
    }
};
Playlist.prototype.getTrackById = function (id) {
    for (var i in this.tracks) {
        if (this.tracks[i].id === id) {
            return this.tracks[i];
        }
    }
    return null;
};
Playlist.prototype.indexOf = function (track) {
    for (var i in this.tracks) {
        if (this.tracks[i] === track) {
            return i;
        }
    }
    return -1;
};
//Remove by index or by value
Playlist.prototype.remove = function (value) {
    if ($.isNumeric(value)) {
        this.tracks.splice(value, 1);
        this.length -= 1;
        return value;
    } else {
        var index = this.indexOf(value);
        if (index > -1) {
            this.tracks.splice(value, 1);
            this.length -= 1;
            return value;
        }
    }
    return null;
};
Playlist.prototype.dequeue = function () {
    if (this.length > 0) {
        this.length -= 1;
        return this.tracks.shift();
    } else {
        return null;
    }
};
Playlist.prototype.clear = function () {
    this.tracks = [];
    this.length = 0;
};
Playlist.prototype.toHash = function () {
    var tracks = [];
    for (var i in this.tracks) {
        tracks.push(this.tracks[i].toHash());
    }
    return {
        id: this.id,
        name: this.name,
        isInternal: this.isInternal,
        isQueue: this.isQueue,
        tracks: tracks
    };
};
