// YouTunes Bridge Object Bridge.js JavaScript Document

function Bridge() {
	this.handlers = [];
}

//Add event handler
Bridge.prototype.on = function (name, callback) {
    var handler = {name: name, id: Date.now(), callback: callback};
    this.handlers.push(handler);
    return handler.id;
};

//Remove event handler
Bridge.prototype.off = function (id) {
    var index = -1;
    for (var i in this.handlers) {
        if (this.handlers[i].id === id) {
            index = i;
            break;
        }
    }
    if (index !== -1) {
        this.handlers.splice(index, 1);
    }
    return this;
};

//Dispatch event
Bridge.prototype.trigger = function (name, data, context) {
    context = (context === undefined) ? window : context;
    for (var i in this.handlers) {
        if (this.handlers[i].name === name) {
            if (data === undefined) {
                this.handlers[i].callback.call(context);
            } else {
                this.handlers[i].callback.call(context, data);
            }
        }
    }
    return this;
};
