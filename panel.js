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

  var open = function (panel) {
    var data = getData(panel);
    open[data.transition](panel, data.position);
    setData(panel, "state", "open");
  }

  open.overlay = function (panel, pos) {
    addStyles(panel, pos, -panel.offsetWidth + 'px');
    setTimeout(function () {
      addStyles(panel, 'opacity', 1, 'z-index', 999, pos, '0px');
      panel.classList.add(positionMap[pos]);
    });
  };

  open.reveal = function (panel, pos) {
    addStyles(panel, 'opacity', 1, 'z-index', 998, pos, '0px');
    findSiblings(panel).forEach(function (sibling) {
      sibling.classList.add(positionMap[pos]);
      addStyles(sibling, pos, panel.offsetWidth + 'px', 'z-index', 999);
    });
  };

  open.push = function (panel, pos) {
    addStyles(panel, 'opacity', 1, 'z-index', 998, pos, '0px');
    panel.classList.add(positionMap[pos]);
    findSiblings(panel).forEach(function (sibling) {
      sibling.classList.add(positionMap[pos]);
      addStyles(sibling, pos, panel.offsetWidth + 'px', 'z-index', 999);
    });
  };

  var close = function (panel) {
    var data = getData(panel);
    close[data.transition](panel, data.position);
    delete panel.dataset.state;
  }

  close.overlay = function (panel, pos) {
    panel.addEventListener(transitionEnd, clean);
    addStyles(panel, pos, -panel.offsetWidth + 'px');
  };

  close.reveal = function (panel, pos) {
    findSiblings(panel).forEach(function (sibling) {
      sibling.panel = panel;
      removeStyles(sibling, pos);
      sibling.addEventListener(transitionEnd, clean);
    });
  };

  close.push = function (panel, pos) {
    findSiblings(panel).forEach(function (sibling) {
      removeStyles(sibling, pos);
      sibling.addEventListener(transitionEnd, clean);
    });
    panel.addEventListener(transitionEnd, clean);
    addStyles(panel, pos, -panel.offsetWidth + 'px');
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

  var getPanel = function (e) {
    var anchor = e.target;

    if (!anchor.hash) return;

    return document.querySelector(anchor.hash);
  };

  var isOpen = function (node) {
    return node.dataset.state == "open";
  };

  var findOpen = function () {
    return document.querySelector('.panel[data-state=open]');
  };

  var getData = function (node) {
    return {
      transition: node.dataset.transition || "overlay",
      state: node.dataset.state || "close",
      position: node.dataset.position || "left"
    };
  };

  var setData = function (node, key, value) {
    node.dataset[key] = value;
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
    var action, transition, state, position, data, openPanel;
    var panel = getPanel(e);

    if (!panel &&
      (e.target.classList.contains('panel') ||
       hasParent(e.target, 'panel'))) return;

    // close currently open panel
    if (panel && isOpen(panel)) {
      close(panel);
      return;
    }

    openPanel = findOpen();

    // close other panel
    if (openPanel) {
      close(openPanel);
      return;
    }

    if (!panel) return;

    action = e.target.dataset.action || "open";
    data = getData(panel);

    if (action == "open" && data.state == "close") {
      open(panel);
    }
  });

}).call(this);
