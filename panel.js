/**
 * panel.js v1.0.0
 * Licensed under The MIT License
 * http://opensource.org/licenses/MIT
 */

(function () {

  var positionMap = {
    left:  'panel-left',
    right: 'panel-right'
  };

  var transitionEnd = "webkitTransitionEnd";

  var open = {
    overlay: function (panel, pos) {
      addStyles(panel, pos, -panel.offsetWidth + 'px');

      setTimeout(function () {
        addStyles(panel, 'opacity', 1, 'z-index', 999, pos, '0px');
        panel.classList.add(positionMap[pos]);
      });
    },

    reveal: function (panel, pos) {
      addStyles(panel, 'opacity', 1, 'z-index', 0, pos, '0px');

      findSiblings(panel).forEach(function (sibling) {
        sibling.classList.add(positionMap[pos]);
        addStyles(sibling, pos, panel.offsetWidth + 'px');
      });
    },

    push: function (panel, pos) {
      addStyles(panel, 'opacity', 1, 'z-index', 0, pos, '0px');
      panel.classList.add(positionMap[pos]);

      findSiblings(panel).forEach(function (sibling) {
        sibling.classList.add(positionMap[pos]);
        addStyles(sibling, pos, panel.offsetWidth + 'px');
      });
    }
  };

  var close = {
    overlay: function (panel, pos) {
      panel.addEventListener(transitionEnd, clean);
      addStyles(panel, pos, -panel.offsetWidth + 'px');
    },

    reveal: function (panel, pos) {
      findSiblings(panel).forEach(function (sibling) {
        sibling.panel = panel;
        removeStyles(sibling, pos);
        sibling.addEventListener(transitionEnd, clean);
      });
    },

    push: function (panel, pos) {
      findSiblings(panel).forEach(function (sibling) {
        removeStyles(sibling, pos);
        sibling.addEventListener(transitionEnd, clean);
      });

      panel.addEventListener(transitionEnd, clean);
      addStyles(panel, pos, -panel.offsetWidth + 'px');
    }
  };

  var clean = function (e) {
    var node = e.target;

    node.removeEventListener(transitionEnd, clean);
    node.classList.remove(positionMap[e.propertyName]);
    removeStyles(node, e.propertyName, "opacity", "z-index");

    if (node.panel) {
      removeStyles(node.panel, e.propertyName, "opacity", "z-index");
      delete node.panel
    }
  }

  var closeAll = function (e) {
    var panel, panels, position;
    var i = 0;

    if (e.target.classList.contains('panel') ||
        hasParent(e.target, 'panel')) return;

    panels = document.querySelectorAll('.panel');

    while (panel = panels[i++]) {
      position = panel.dataset.position || "left";
      transition = panel.dataset.transition || "overlay";
      close[transition](panel, position);
    }
  };

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

  var findSiblings = function (node) {
    var child = node.parentNode.firstChild;
    var siblings = [];

    while (child = child.nextSibling) {
      if (child.nodeType == 1 &&
          node != child &&
          !child.classList.contains('panel')) {

        siblings.push(child);
      }
    }

    return siblings;
  };

  var addStyles = function (node, styles) {
    var args, i, key;

    if (styles === Object(styles)) {
      for (key in styles) {
        node.style[key] = styles[key];
      }
    }
    else {
      args = arguments;
      for (i = 1, l = args.length - 1; i < l; i += 2) {
        node.style[args[i]] = args[i + 1];
      }
    }
  };

  var removeStyles = function (node, styles) {
    var i;
    var args = arguments;

    for (i = 1, l = args.length; i < l; i++) {
      node.style[args[i]] = "";
    }
  };

  // events

  window.addEventListener('click', function (e) {
    var action, transition, state, position;
    var panel = getPanel(e);

    if (!panel) {
      closeAll(e);
      return;
    }

    // options
    action = e.target.dataset.action || "open";
    transition = panel.dataset.transition || "overlay";
    state = panel.dataset.state || "open";
    position = panel.dataset.position || "left";

    if (action == "open" && state == "open") {
      open[transition](panel, position);
      panel.dataset.state = "close";
    }
    else {
      close[transition](panel, position);
      delete panel.dataset.state;
    }

    e.preventDefault();

  }, false);

})();
