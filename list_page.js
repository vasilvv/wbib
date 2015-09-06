function setupWBIBListManagerPage() {
  window.WBIBListPage = {
    refreshInProgress: false,

    setup: function() {
      var heading = document.getElementById('firstHeading');
      var root = document.getElementById('mw-content-text');

      document.title = msg('list_header');
      setNodeText(heading, msg('list_header'));
      root.innerHTML =
        // Clear button
        '<div style="float: right">' +
        '<button id="wbib-clear">' + msg('list_clear') + '</button>' +
        '</div>' +
        // Page count paragraph.
        '<p id="wbib-list-count"></p>' +
        // The list itself.
        '<fieldset>' +
        '<legend>' + msg('list_legend_show') + '</legend>' +
        '<div id="wbib-list"></div>' +
        '</fieldset>' +
        // The manual add form.
        '<fieldset>' +
        '<legend>' + msg('list_legend_add') + '</legend>' +
        '<form id="wbib-add-form"><table>' +
        '<tr><td class="mw-label">' + msg('list_add_label') + '</td>' +
        '<td class="mw-input"><input id="wbib-add-title" type="text" /></td>' +
        '</tr><tr><td></td><td class="mw-input">' +
        '<button type="submit">' + msg('list_add_button') + '</button>' +
        '</td></tr>' +
        '</table></form></fieldset>';
      WBIBListManager.count(window.WBIBListPage.onCountReceived);

      var form = document.getElementById('wbib-add-form');
      form.addEventListener('submit', window.WBIBListPage.onPageAddRequested);

      var clearButton = document.getElementById('wbib-clear');
      clearButton.addEventListener('click',
                                   window.WBIBListPage.onClearRequested);
    },

    onCountReceived: function(count) {
      var p = document.getElementById('wbib-list-count');

      p.innerText = msg('list_count', count);
      window.WBIBListPage.refresh();
    },

    refresh: function() {
      if (window.WBIBListPage.refreshInProgress) {
        return;
      }

      window.WBIBListPage.refreshInProgress = true;
      window.WBIBListPage.pageCount = 0;

      var list = document.getElementById('wbib-list');
      var spinner = $.createSpinner()[0];
      var label = document.createElement('div');
      label.innerText = msg('list_loading');
      label.style.display = 'inline';
      label.style.paddingLeft = '1em';

      clearNode(list);
      list.appendChild(spinner);
      list.appendChild(label);

      window.WBIBListPage.ol = document.createElement('ol');
      window.WBIBListManager.iterate(window.WBIBListPage.renderItem,
                                     window.WBIBListPage.finishRefresh);
    },

    renderItem: function(title) {
      window.WBIBListPage.pageCount += 1;

      var a = document.createElement('a');
      var titleText = title.toText();
      setNodeText(a, titleText);
      a.href = title.getUrl();

      var removeLink = document.createElement('a');
      removeLink.addEventListener('click', function(event) {
        window.WBIBListManager.remove(title, window.WBIBListPage.onRemoved);
      });
      appendText(removeLink, msg('list_remove'));

      var li = document.createElement('li');
      li.appendChild(a);
      appendText(li, ' (');
      li.appendChild(removeLink);
      appendText(li, ')');
      li.wbibPageTitle = titleText;

      window.WBIBListPage.ol.appendChild(li);
    },

    finishRefresh: function() {
      var list = document.getElementById('wbib-list');
      clearNode(list);
      if (window.WBIBListPage.pageCount > 0) {
        list.appendChild(window.WBIBListPage.ol);
      } else {
        var label = document.createElement('p');
        label.innerText = msg('list_empty');
        list.appendChild(label);
      }

      var counter = document.getElementById('wbib-list-count');
      counter.innerText = msg('list_count', window.WBIBListPage.pageCount);

      window.WBIBListPage.ol = null;
      window.WBIBListPage.refreshInProgress = false;
    },

    onPageAddRequested: function(event) {
      event.preventDefault();

      var textbox = document.getElementById('wbib-add-title');
      var title = mw.Title.newFromText(textbox.value);
      if (title == null) {
        mw.notice(msg('list_add_invalid_title', textbox.value));
        return false;
      }

      window.WBIBListManager.add(title, window.WBIBListPage.refresh);

      return false;
    },

    onClearRequested: function(event) {
      window.WBIBListManager.clear(window.WBIBListPage.refresh);
    },

    onRemoved: function(title) {
      var list_root = document.getElementById('wbib-list');
      var list = list_root.getElementsByTagName('ol')[0];
      var elems = list.childNodes;
      var titleText = title.toText();
      for (var i = 0; i < elems.length; i++) {
        if (elems[i].wbibPageTitle == titleText) {
          list.removeChild(elems[i]);
          break;
        }
      }
    }
  };

  window.WBIBListPage.setup();
}
