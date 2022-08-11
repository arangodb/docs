// Markers should be used everywhere in markdown as well as in code blocks, but css gets broken, so having 2 functions is a workaround,
// Only one generic marker function should be used for all cases.

createCodeAnnotations();
createMarkedAnnotations();


// Code Blocks Annotation, workaround to avoid broken css inside code block box
function createCodeAnnotations() {
  var commentRegex = /\/\/.*/g;
  const codeBlocks = document.querySelectorAll('code');

  codeBlocks.forEach(block => {
    let annotations = block.innerText.match(commentRegex);
    annotations.forEach(annotation => {
      let annotationTemplate = "<div class='annotation-wrapper'><div class='annotation'><div class='annotation-icon'><div class='annotation-tooltip'>"+annotation+"</div><span><i class='fas fa-plus-circle'></i></span></div></div></div>";
      block.innerHTML = block.innerHTML.replace(annotation, annotationTemplate);
    })
  })
}

// Generic Markers Annotation
function createMarkedAnnotations() {
  const markers = document.querySelectorAll('marker');

  markers.forEach(marker => {
    let annotation = document.querySelector('.annotation-wrapper#'+marker.id);
    if (marker.id === annotation.id) {
      marker.innerHTML = annotation.outerHTML;
      annotation.remove();
    }
  });
}
