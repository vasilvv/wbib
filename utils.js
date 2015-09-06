/**
 * Returns a localized message text for specified message key.
 *
 * @param {string} msg Message key.
 * @return {string}
 */
var msg = function(msg) {
  var txt = window.WBIBMsg[msg];
  if (typeof(txt) == 'undefined') {
    return '?' + arguments[0] + '?';
  }
  for (var i = 0; i < arguments.length; i++) {
    var re = new RegExp('\\$' + i.toString(), 'g');
    txt = txt.replace(re, arguments[i]);
  }
  return txt;
};

/**
 * Removes all children of the specified node.
 *
 * @param {Node} node Node to remove the subnodes from.
 */
var clearNode = function(node) {
  while (node.hasChildNodes()) {
    node.removeChild(node.firstChild);
  }
};

/**
 * Appends text to the end of the node's contents.
 *
 * @param {Node} node Node to append the text to.
 * @param {string} text Text to append to the node.
 */
var appendText = function(node, text) {
  node.appendChild(document.createTextNode(text));
};

/**
 * Replaces the contents of a node with a text.
 *
 * @param {Node} node Node which children are being replaced with text.
 * @param {string} text Text to replace the node's contents with.
 */
var setNodeText = function(node, text) {
  clearNode(node);
  appendText(node, text);
};

/**
 * Unified way to display error messages.
 *
 * @param {string} msg Name of the error message to display....
 * @return {function(object)}
 */
var errorHandler = function(msg) {
  return function(event) {
    console.log(event);
    alert(window.WBIBMsg[msg]);
  }
};

// Required for most UI pages involved.
mw.loader.load('jquery.spinner');
