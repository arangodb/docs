var assert = function(condition) {
  if (! condition) {
    throw new Error('assertion failed');
  }
};

function cleanupAfterExample() {
  for (let col of db._collections()) {
    if (db.ignore.exists(collectionName) != false){
      continue
    }

    if (!col.properties().isSystem) {
      db._drop(col._name);
    }
  }
}

var addIgnoreCollection = function(collectionName) {
  if (!db.ignore.exists(collectionName)) {
    db.ignore.insert({_key: collectionName, value: 1})
    return
  }
};

var addIgnoreView = function(viewName) {
  addIgnoreCollection(viewName);
};

var removeIgnoreCollection = function(collectionName) {
  var collection = db.ignore.exists(collectionName);
  if (collection == false) {
    return
  }

  db.ignore.remove(collection);
};

var removeIgnoreView = function (viewName) {
  removeIgnoreCollection(viewName);
};



