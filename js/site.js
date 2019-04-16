var anchorForId = function(id) {
  var anchor = document.createElement("a");
  anchor.className = "header-link";
  anchor.href = "#" + id;
  anchor.innerHTML =
    '<span class="sr-only">Permalink</span><i class="fa fa-link"></i>';
  anchor.title = "Permalink";
  return anchor;
};

var linkifyAnchors = function(level, containingElement) {
  var headers = containingElement.getElementsByTagName("h" + level);
  for (var h = 0; h < headers.length; h++) {
    var header = headers[h];

    if (typeof header.id !== "undefined" && header.id !== "") {
      header.appendChild(anchorForId(header.id));
    }
  }
};

document.onreadystatechange = function() {
  if (this.readyState === "complete") {
    var contentBlock = document.getElementsByClassName("book-body")[0];
    if (!contentBlock) {
      return;
    }

    generateToc();
    for (var level = 1; level <= 6; level++) {
      linkifyAnchors(level, contentBlock);
    }
  }
};

$(document).ready(function handleNav() {
  $("nav a").click(function(event) {
    event.preventDefault();
    $.get({
      url: event.target.href,
      success: function(newDoc) {
        $(".book-body").replaceWith($(".book-body", newDoc));
        var current = $("nav .active");
        current.removeClass("active");
        $(event.target)
          .parent()
          .addClass("active");
        $(event.target)
          .parent()
          .addClass("selected");
        var current = $("nav .selected.active").removeClass("active");

        if (!window.disablePageToc) {
          generateToc();
        }
      }
    });
  });
});

var generateToc = function() {
  var contentBlock = document.getElementsByClassName("book-body")[0];
  if (!contentBlock) {
    return;
  }

  var nodes = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  if (nodes.length < 3) {
    return;
  }

  var tree = {
    level: 0,
    items: []
  };
  var current = tree;
  var stack = [];

  var currentLevel = 1;
  var currentParent = document.createElement("ul");
  var parents = [
    {
      level: 1,
      element: currentParent
    }
  ];
  var lastElement = null;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes.item(i);
    var level = parseInt(node.tagName[1], 10);
    if (level < currentLevel) {
      while (level < currentLevel) {
        var last = parents.pop();
        currentParent = parents[parents.length - 1].element;
        currentLevel = parents[parents.length - 1].level;
      }
    } else if (level > currentLevel) {
      var newParent = document.createElement("ul");
      if (lastElement) {
        lastElement.appendChild(newParent);
      }
      currentParent = newParent;
      currentLevel = level;
      parents.push({
        level: level,
        element: currentParent
      });
    }

    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + node.id;
    a.textContent = node.textContent;

    li.appendChild(a);
    currentParent.appendChild(li);

    lastElement = li;
  }

  var root;
  if (parents.length > 0) {
    root = parents[0].element;
  } else {
    root = currentParent;
  }

  var nav = document.createElement("nav");
  nav.className = "page-toc";

  nav.appendChild(root);

  var wrapper = document.querySelector(".markdown-section");
  wrapper.insertBefore(nav, wrapper.firstChild);
};
