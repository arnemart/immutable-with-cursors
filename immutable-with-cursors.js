var Immutable = require('immutable');

var toWrap = {
    'Map': ['set', 'delete', 'clear', 'merge', 'mergeWith', 'mergeDeep', 'mergeDeepWith', 'withMutations'],
    'OrderedMap': ['clear', 'set', 'delete'],
    'Vector': ['set', 'delete', 'clear', 'pop', 'shift', 'merge', 'mergeWith', 'mergeDeep', 'mergeDeepWith', 'setLength', 'slice']
};

function wrapFunctions(obj, functions) {
    var p = obj.prototype;
    for (var key in p) {
        (function(key) {
            if (p.hasOwnProperty(key) && functions.indexOf(key) > -1) {
                var wrapped = p[key];
                p[key] = function() {
                    return this.triggerWatchers(wrapped.apply(this, arguments));
                };
            }
        })(key);
    }
    obj.prototype = p;
    return obj;
}

function wrapSequence(seq) {
    seq.prototype.watch = function(watcher) {
        if (!this._watchers) {
            this._watchers = [];
        }
        this._watchers.push(watcher);
    };

    seq.prototype.unwatch = function(watcher) {
        if (this._watchers) {
            var index = this._watchers.indexOf(watcher);
            if (index >= 0) {
                this.watchers.splice(index, 1);
            }
        }
    };

    seq.prototype.triggerWatchers = function(value) {
        if (this._watchers && this._watchers.length) {
            this._watchers.forEach(function(watcher) {
                watcher(value);
            });
        }
        return value;
    };

    seq.prototype.cursor = function(searchKeyPath, callback, notFoundValue) {
        var self = this;
        var val = getInDeepSequence(this, searchKeyPath, notFoundValue, 0);
        val.watch(function(newVal) {
            callback(self.updateIn(searchKeyPath, function() { return newVal ; }));
        });
        return val;
    };

    return seq;
}

var ImmutableWithCursors = {};

for (var key in Immutable) {
    if (Immutable.hasOwnProperty(key)) {
        if (key === 'Sequence') {
            ImmutableWithCursors[key] = wrapSequence(Immutable[key]);
        } if (toWrap[key]) {
            ImmutableWithCursors[key] = wrapFunctions(Immutable[key], toWrap[key]);
        } else {
            ImmutableWithCursors[key] = Immutable[key];
        }
    }
};

module.exports = ImmutableWithCursors;
