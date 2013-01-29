(function () {

  var transition = function (panel, className) {
    if (className == "reveal") {
      panel.classList.remove('panel-transition-left');
    }

    if (className == "reveal" || className == "push") {
      eachSibling(panel, function (sibling) {
        sibling.classList.add('panel-transition-left');
        sibling.style.left = panel.offsetWidth + 'px';
      });
    }

    panel.classList.add(className);
  }

  var closeAll = function (e) {
    var i = 0;
    var panel, panels;

    if (e.target.classList.contains('panel') ||
        hasParent(e.target, 'panel')) return;

    panels = document.querySelectorAll('.panel');
    while (panel = panels[i++]) {
      close(panel, panel.dataset.transition);
    }
  };

  var close = function (panel, className) {
    eachSibling(panel, function (sibling) {
      sibling.style.left = '0px';
    });

    panel.classList.add('panel-transition-left');
    panel.classList.remove(className);
  }

  var getPanel = function (e) {
    var anchor = e.target;

    if (!anchor.hash) return;

    return document.querySelector(anchor.hash);
  };

  // dom helpers

  var hasParent = function (node, selector) {
    node = node.parentNode;

    while (node.parentNode) {
      if (node.classList.contains(selector)) return true;
      node = node.parentNode;
    }

    return false;
  };

  var eachSibling = function (node, callback) {
    var child = node.parentNode.firstChild;

    while (child = child.nextSibling) {
      if (child.nodeType == 1 &&
          node != child &&
          !child.classList.contains('panel')) {
        callback && callback(child);
      }
    }
  };

  // events

  window.addEventListener('click', function (e) {
    var action, className;
    var panel = getPanel(e);

    if (!panel) {
      closeAll(e);
      return;
    }

    // options
    action = e.target.dataset.action || "open";
    className = panel.dataset.transition || "overlay";

    if (action == "close" ||
      panel.classList.contains(className)) {
      close(panel, className);
      return;
    }

    panel.classList.add('panel-transition-left');
    transition(panel, className);

  }, false);

})();
