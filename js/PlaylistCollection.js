// YouTunes PlaylistCollection Object PlaylistCollection.js JavaScript Document

function PlaylistCollection() {

	this.playlists = [];

	this.length = 0;
}

PlaylistCollection.prototype.add = function (playlistOrPlaylists) {
    this.playlists.push(playlistOrPlaylists);
    this.length += 1;
};
PlaylistCollection.prototype.get = function (index) {
    return (index > -1 && index < this.playlists.length) ? this.playlists[index] : null;
};
PlaylistCollection.prototype.getPlaylistById = function (id) {
    for (var i in this.playlists) {
        if (this.playlists[i].id === id) {
            return this.playlists[i];
        }
    }
    return null;
};
PlaylistCollection.prototype.getPlaylistByName = function (name) {
    for (var i in this.playlists) {
        if (this.playlists[i].name === name) {
            return this.playlists[i];
        }
    }
    return null;
};
PlaylistCollection.prototype.indexOf = function (playlist) {
    for (var i in this.playlists) {
        if (this.playlists[i] === playlist) {
            return i;
        }
    }
    return -1;
};
//Remove by index or by value
PlaylistCollection.prototype.remove = function (value) {
    if ($.isNumeric(value)) {
        this.playlists.splice(value, 1);
        this.length -= 1;
        return value;
    } else {
        var index = this.indexOf(value);
        if (index > -1) {
            this.length -= 1;
            return this.remove(index);
        }
    }
    return null;
};
PlaylistCollection.prototype.clear = function () {
    this.playlists = [];
    this.length = 0;
};
PlaylistCollection.prototype.save = function (callback) {
    chrome.storage.local.set({'playlists': this.toHash()}, function () {
        var success = chrome.runtime.lastError === undefined;
        callback({success: success});
    });
};
PlaylistCollection.prototype.toHash = function () {
    var playlists = [];
    for (var i in this.playlists) {
        playlists.push(this.playlists[i].toHash());
    }
    return playlists;
};
