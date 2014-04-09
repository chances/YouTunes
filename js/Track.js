// YouTunes Track Object Track.js JavaScript Document

function Track(idOrHash, title, duration, thumbnail, coverPhoto) {

    if (typeof idOrHash == 'string' || idOrHash instanceof String) {
        this.id = idOrHash;
        this.title = (title === undefined) ? "" : title;
        this.duration = (duration === undefined) ? 0 : duration;
        this.thumbnail = (thumbnail === undefined) ? null : thumbnail;
        this.coverPhoto = (coverPhoto === undefined) ? null : coverPhoto;
    } else {
        this.id = idOrHash.id;
        this.title = idOrHash.title;
        this.duration = idOrHash.duration;
        this.thumbnail = idOrHash.thumbnail;
        this.coverPhoto = idOrHash.coverPhoto;
    }
}

Track.prototype.toHash = function () {
    return {
        id: this.id,
        title: this.title,
        duration: this.duration,
        thumbnail: this.thumbnail,
        coverPhoto: this.coverPhoto
    };
};
