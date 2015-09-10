var api = new mw.Api();

/**
 * Makes a query request to MediaWiki API.  Handles continues automatically.
 * The limit, however, has to be set manually by the caller.
 *
 * @param {Object} rqParams Request parameters for the API.
 * @param {function(Object, number): number} onData Called when the data is
 *   received from the API.
 * @param {function(number)} onComplete Called when the request is complete.
 */
var makeApiQuery = function(rqParams, onData, onComplete) {
  rqParams.action = 'query';

  var processRequestData = function(data, count) {
    var newCount = onData(data, count);

    if ('batchcomplete' in data || !('continue' in data)) {
      onComplete(newCount);
      return;
    }

    var newParams = rqParams;
    $.extend(newParams, data['continue']);

    var request = api.get(newParams).done(function(newData) {
      processRequestData(newData, newCount);
    });
  };

  api.get(rqParams).done(function(data) {
    processRequestData(data, 0);
  });
};

/**
 * Makes a query request to MediaWiki API, where the sole purpose of the
 * request is to retrieve a list of titles from API.
 *
 * @param {Object} rqParams Request parameters for the API.
 * @param {function(Object): Array<mw.Title>} handler Function that converts
 *   API repsonses into lists of titles.
 * @param {function(Array<mw.Title>, number)} onTitles Called when page titles
 *   are received from the API.
 * @param {function(number)} onComplete Called when the request is complete.
 */
var makeApiQueryForTitles = function(rqParams, handler, onTitles, onComplete) {
  var onData = function(data, count) {
    var titles = handler(data, count);
    onTitles(titles, count);
    return count + titles.length;
  };

  makeApiQuery(rqParams, onData, onComplete);
};

var pageLinksHandler = function(data) {
  var titles = [];
  for (var pageid in data.query.pages) {
    var page = data.query.pages[pageid];
    for (var i = 0; i < page.links.length; i++) {
      var title = mw.Title.newFromText(page.links[i].title, page.links[i].text);
      titles.push(title);
    }
  }
  return titles;
};
