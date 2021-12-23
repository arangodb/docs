var versionSwitcherSetAvailable = function(versions) {
  var options = document.querySelector(".arangodb-version-switcher").options;
  for (var i = 0; i < options.length; i++) {
    var item = options.item(i);
    if (versions.indexOf(item.value) != -1) {
      item.removeAttribute("disabled");
      item.removeAttribute("title");
    } else {
      item.setAttribute("disabled", "");
      item.setAttribute("title", "This page is not available in version " + item.value);
    }
  }
};

var anchorForId = function(id) {
  var anchor = document.createElement("a");
  anchor.className = "anchor-link";
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

var linkifyExamples = function(className, containingElement) {
  var examples = containingElement.getElementsByClassName(className);
  for (var e = 0; e < examples.length; e++) {
    var example = examples[e];

    if (typeof example.id !== "undefined" && example.id !== "") {
      example.insertBefore(anchorForId(example.id), example.firstChild);
    }
  }
};

var enableHamburger = function enableHamburger() {
  $(".book-header .hamburger").click(function(event) {
    event.preventDefault();
    $('div.book').toggleClass("without-summary");
    $('div.book').toggleClass("with-summary");
  })
};

var linkify = function() {
  var contentBlock = document.querySelector(".markdown-section");
  if (!contentBlock) {
    return;
  }

  // no anchors for level 1 because they are the start of the page anyway?
  for (var level = 2; level <= 6; level++) {
    linkifyAnchors(level, contentBlock);
  }

  linkifyExamples("example-container", contentBlock);
}

document.onreadystatechange = function() {
  if (this.readyState === "complete") {
    linkify();
  }
};

var loadPage = function(target, fn) {
  var href = target.href;
  var pathname = target.pathname;
  var url = href.replace(/#.*$/, "");
  var elem;
  if (url == currentPage) {
    // same page, but anchor might have changed
    if (target.hash == "") {
      // user clicked on current page in navigation, scroll to top
      elem = document.querySelector(".book-header");
    } else {
      // location.hash is already target.hash here
      elem = document.querySelector(target.hash);
    }
    if (elem) {
      elem.scrollIntoView();
    }
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
      $("nav .expanded").addClass("selected");

      linkify();
      if (fn) {
        fn();
      }

      gtag('config', 'UA-81053435-1', {
        'page_title': title,
        'page_path': pathname
      });

      var _hsq = window._hsq = window._hsq || [];
      _hsq.push(['setPath', pathname]);
      _hsq.push(['trackPageView']);

    }
  });
}

window.onpopstate = function(event) {
  loadPage(event.target.location);
};

$(document).ready(function () {
  // Scroll to anchor
  if (location.hash.length > 1) {
    var elem = document.querySelector(location.hash);
    if (elem) {
      elem.scrollIntoView();
    }
  }

  // Handle navigation
  $("div.book-summary nav a").click(function(event) {
    // get source code value, not the absolute URL from .href!
    var hrefAttr = event.target.getAttribute("href");
    if (hrefAttr && (
        hrefAttr.startsWith("http://") ||
        hrefAttr.startsWith("https://"))) {
      // let browser handle external link in navigation
      return true;
    }
    event.preventDefault();
    loadPage(event.target, function(title) {
      $(event.target)
        .parent()
        .addClass("selected");
      if (window.history) {
        window.history.pushState("navchange", title, event.target.href);
      }
      enableHamburger();
    })
  });
  enableHamburger();

  // Hide navigation on mobile
  if (window.matchMedia("(max-width: 800px)").matches) {
    $('div.book')
      .addClass("without-animation")
      .removeClass("with-summary")
      .addClass("without-summary")
      .offset();
    $('div.book')
      .removeClass("without-animation");
  }
})

var generateToc = function(maxHeadlineLevel) {
  var contentBlock = document.querySelector(".markdown-section");
  if (!contentBlock) {
    return;
  }
  var maxHeadlineLevel = maxHeadlineLevel || 6;
  var headlineLevels = ["h1", "h2", "h3", "h4", "h5", "h6"]
  var nodes = contentBlock.querySelectorAll(headlineLevels.slice(0, maxHeadlineLevel).join(","));
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

  contentBlock.insertBefore(nav, contentBlock.firstChild);
};

window.currentPage = location.href.replace(/#.*$/, "");
