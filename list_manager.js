/**
 * Manages current list of pages.
 */
window.WBIBListManager = {
  init: function(onsuccess) {
    var req = window.indexedDB.open('WBIB', 1);
    req.onsuccess = function(event) {
      window.WBIBListManager.db = event.target.result;
      onsuccess(event);
    };
    req.onerror = errorHandler('failed_load');
    req.onupgradeneeded = WBIBListManager.create;
  },

  create: function(event) {
    var db = event.target.result;

    db.createObjectStore('pagelist', { keyPath: 'fulltext' });
  },

  count: function(callback) {
    var db = window.WBIBListManager.db;

    var req = db.transaction('pagelist').objectStore('pagelist').count();
    req.onerror = errorHandler('failed_count');
    req.onsuccess = function(event) { callback(event.target.result) };
  },

  clear: function(callback) {
    var db = window.WBIBListManager.db;

    var store = db.transaction('pagelist', 'readwrite').objectStore('pagelist');
    var req = store.clear();
    req.onerror = errorHandler('failed_clear');
    if (callback) {
      req.onsuccess = function(event) { callback(event.target.result) };
    }
  },

  add: function(title, callback) {
    var db = window.WBIBListManager.db;

    var entry = {
      fulltext: title.toText()
    };

    var store = db.transaction('pagelist', 'readwrite').objectStore('pagelist');
    var req = store.put(entry);
    req.onerror = errorHandler('failed_add');
    if (callback) {
      req.onsuccess = function(event) { callback(title) };
    }
  },

  remove: function(title, callback) {
    var db = window.WBIBListManager.db;

    var store = db.transaction('pagelist', 'readwrite').objectStore('pagelist');
    var req = store['delete'](title.toText());
    req.onerror = errorHandler('failed_remove');
    if (callback) {
      req.onsuccess = function(event) { callback(title) };
    }
  },

  iterate: function(onitem, onfinished) {
    var db = window.WBIBListManager.db;
    var store = db.transaction('pagelist').objectStore('pagelist');
    store.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;

      if (cursor) {
        var title = mw.Title.newFromText(cursor.value.fulltext);
        onitem(title);
        cursor.continue();
      } else {
        onfinished();
      }
    };
  }
};
