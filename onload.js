/**
 * Called when the internal WBIB database is successfully opened.  Invokes all
 * page-specific code as necessary.
 *
 * @param {Object} event Event details passed from IndexedDB.
 */
window.WBIBDBLoaded = function(event) {
  if (mw.config.get('wgNamespaceNumber') == -1 &&
      mw.config.get('wgTitle') == 'WBIBList') {
    setupWBIBListManagerPage();
  }
};
