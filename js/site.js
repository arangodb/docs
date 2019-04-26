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

var linkify = function() {
  var contentBlock = document.getElementsByClassName("book-body")[0];
  if (!contentBlock) {
    return;
  }

  for (var level = 1; level <= 6; level++) {
    linkifyAnchors(level, contentBlock);
  }
}

document.onreadystatechange = function() {
  if (this.readyState === "complete") {
    linkify();
  }
};

var loadPage = function(href, fn) {
  var url = href.replace(/#.*$/, "");
  if (url == currentPage) {
    return;
  }
  $.get({
    url: url,
    success: function(newDoc) {
      var re = new RegExp(/<title>(.*)<\/title>/, 'mg');
      var match = re.exec(newDoc);
      var title = "ArangoDB Documentation";
      if (match) {
        title = match[1];
      }
      document.title = title;

      $(".book-body").replaceWith($(".book-body", newDoc));
      var current = $("nav .active");
      current.removeClass("active");

      currentPage = url;
      if (matches = href.match(/.*?(#.*)$/)) {
        location.hash = matches[1];
      }

      url = url.endsWith('/') ? url + 'index.html' : url;
      $("nav .selected.active").removeClass("active");
      $("nav .selected").removeClass("selected");
      var current = $('nav a[href="' + url.split('/').slice(-1) + '"]').parent();
      current.addClass("active");

      while (current.length > 0 && current.prop("tagName") != "NAV") {
        if (current.prop("tagName") == "LI") {
          current.addClass("selected");
        }
        current = current.parent();
      }
      linkify();
      if (fn) {
        fn();
      }
    }
  });
}

window.onpopstate = function(event) {
  loadPage(event.target.location.href);
};

$(document).ready(function handleNav() {
  $("div.book-summary nav a").click(function(event) {
    event.preventDefault();
    loadPage(event.target.href, function(title) {
      $(event.target)
        .parent()
        .addClass("selected");
      if (window.history) {
        window.history.pushState("navchange", title, event.target.href);
      }
    })
  });
});

$(document).ready(function enableHamburger() {
  $(".book-header .hamburger").click(function(event) {
    event.preventDefault();
    $('div.book').toggleClass("without-summary");
    $('div.book').toggleClass("with-summary");
  })
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

  var currentLevel = 1;
  var currentParent = document.createElement("ul");
  var parents = [
    {
      level: 1,
      element: currentParent
    }
  ];
  var lastElement = currentParent;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes.item(i);
    var level = parseInt(node.tagName[1], 10);
    if (level < currentLevel) {
      while (level < currentLevel) {
        parents.pop();
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

window.currentPage = location.href;