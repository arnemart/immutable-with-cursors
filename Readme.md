# Immutable Data Collections With Cursors

This is a simple wrapper around [Facebooks immutable data collection library](https://github.com/facebook/immutable-js), adding [Om](https://github.com/swannodette/om)-style cursors.

Cursors are a way of passing around smaller parts of a larger data structure, that will call back to the parent data structure when updated. This is very useful in component-based web libraries (e.g. React), where sub components only should be passed the subset of data that they need, yet must be able to pass updates back up the tree.

[Usage example with React](git@github.com:arnemart/immutable-with-cursors.git).

## API

### coll.watch(watcher)

Register a watcher to be triggered when the collection is updated.

### coll.unwatch(watcher)

Remove a registered watcher.

### coll.triggerWatchers(value)

Calls all registered watchers with the passed value, then returns the value.

### coll.cursor(keypath, callback, notFoundValue

Creates a cursor at the given keypath and returns it. When the cursor is updated, tha callback is called with the parent collection.
