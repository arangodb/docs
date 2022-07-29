const showOnPx = 100;
const backToTopButton = document.querySelector(".back-to-top");
var innerBody = document.querySelector("#body-inner");

innerBody.onscroll = function() {scrollListener()};

function scrollListener() {
    if (innerBody.scrollTop > showOnPx) {
        backToTopButton.classList.remove("hidden");
      } else {
        backToTopButton.classList.add("hidden");
      }
};

const goToTop = () => {
    innerBody.scrollTo({top: 0, behavior: 'smooth'});
  };
