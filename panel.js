(function () {

  var positions = {
    left: 'panel-transition-left',
    right: 'panel-transition-right'
  };

  var pushRevealRegex = /reveal|push/;

  var open = function (panel, transition) {
    var method = (transition == "reveal") ? 'remove' : 'add';

    panel.classList[method](positions.left);

    if (transition.match(pushRevealRegex) != null) {
      getSiblings(panel).forEach(function (sibling) {
        if (!sibling.classList.contains('panel')) {
          sibling.classList.add(positions.left);
          sibling.style.left = panel.offsetWidth + 'px';
        }
      });
    }

    panel.classList.add(transition);
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
    getSiblings(panel).forEach(function (sibling) {
      if (!sibling.classList.contains('panel')) {
        sibling.style.left = '0px';
      }
    });

    if (className != "reveal") {
      panel.classList.remove(className);
    }
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

  var getSiblings = function (node, callback) {
    var child = node.parentNode.firstChild;
    var siblings = [];

    while (child = child.nextSibling) {
      if (child.nodeType == 1 &&
          node != child) {
        siblings.push(child);
      }
    }

    return siblings;
  };

  // events

  window.addEventListener('click', function (e) {
    var action, transition, state;
    var panel = getPanel(e);

    if (!panel) {
      closeAll(e);
      return;
    }

    // options
    action = e.target.dataset.action || "open";
    transition = panel.dataset.transition || "overlay";
    state = panel.dataset.state || "open";

    if (action == "open" && state == "open") {
      open(panel, transition);
      panel.dataset.state  = "close";
    }
    else {
      close(panel, transition);
      panel.dataset.state  = "open";
    }

  }, false);

})();
