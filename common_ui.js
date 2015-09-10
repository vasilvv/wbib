/**
 * A spinner wheel with a user-specified label.
 *
 * @param {string} id ID of the spinner wheel element.
 * @param {string} initialText Initial text next to the spinner wheel.
 * @constructor
 */
var Spinner = function(id, initialText) {
  this.icon = $.createSpinner()[0];
  this.text = document.createTextNode(initialText);

  this.text_div = document.createElement('div');
  this.text_div.style.display = 'inline';
  this.text_div.style.paddingLeft = '1em';
  this.text_div.appendChild(this.text);

  this.div = document.createElement('div');
  this.div.id = id;
  this.div.style.display = 'none';
  this.div.appendChild(this.icon);
  this.div.appendChild(this.text_div);
};

/**
 * Makes the spinner wheel visible.
 */
Spinner.prototype.show = function() {
  this.div.style.display = 'block';
};

/**
 * Makes the spinner wheel not visible.
 */
Spinner.prototype.hide = function() {
  this.div.style.display = 'none';
};

/**
 * Changes the text displayed by the spinner wheel.
 *
 * @param {string} text The new text for the spinner wheel.
 */
Spinner.prototype.setText = function(text) {
  this.text.nodeValue = text;
};
