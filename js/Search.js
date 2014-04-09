// YouTunes Search Object Search.js JavaScript Document

function Search(serializedSearch) {

    this.query = (serializedSearch === undefined) ? null : serializedSearch.query;
    this.startIndex = (serializedSearch === undefined) ? 1 : serializedSearch.startIndex;
    this.results = new Playlist('search');
    if (serializedSearch !== undefined) {
        this.results.add(serializedSearch.results);
    }
    this.totalResultCount = (serializedSearch === undefined) ? 0 : serializedSearch.totalResultCount;
}


Search.prototype.save = function (callback) {
    chrome.storage.local.set({'search': this.toHash()}, function () {
        var success = chrome.runtime.lastError === undefined;
        callback({success: success});
    });
};
Search.prototype.toHash = function () {
    return {
        query: this.query,
        startIndex: this.startIndex,
        results: this.results.toHash().tracks,
        totalResultCount: this.totalResultCount
    };
};
