(function () {

  var transitions = {
    overlay: function (panel, className) {
      panel.classList.add('transition-left');
      panel.classList.toggle(className);
    },

    reveal: function (panel, className) {
      var siblings;
      var i = 0;

      panel.classList.remove('transition-left');
      panel.classList.toggle(className);

      siblings = getSiblings(panel);

      while (sibling = siblings[i++]) {
        sibling.classList.add('transition-left');
        sibling.classList.toggle(className);
      }
    }
  };

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

  var close = function (panel, transition) {
    panel.classList.remove(transition);
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

  var getSiblings = function (node) {
    var child = node.parentNode.firstChild;
    var siblings = [];

    while (child = child.nextSibling) {
      if (child.nodeType == 1 && node != child) {
        siblings.push(child);
      }
    }

    return siblings;
  };

  // events

  window.addEventListener('click', function (e) {
    var action, transition;
    var panel = getPanel(e);

    if (!panel) {
      closeAll(e);
      return;
    }

    // options
    action = e.target.dataset.action || "open";
    transition = panel.dataset.transition || "overlay";

    if (action == "close") {
      close(panel, transition);
      return;
    }

    transitions[transition](panel, transition);

  }, false);

})();
