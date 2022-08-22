// Markers should be used everywhere in markdown as well as in code blocks, but css gets broken, so having 2 functions is a workaround,
// Only one generic marker function should be used for all cases.

createCodeAnnotations();
createMarkedAnnotations();


// Code Blocks Annotation, workaround to avoid broken css inside code block box
function createCodeAnnotations() {
  var commentRegex = /(?<=\/\/:annotation:).*/g;
  const codeBlocks = document.querySelectorAll('code');
  if (codeBlocks == null) return

  for(let block of codeBlocks) {
    let annotations = block.innerText.match(commentRegex);
    if (annotations == null) continue

    for(let annotation of annotations) {
      let annotationTemplate = "<div class='annotation-wrapper'><div class='annotation'><div class='annotation-icon'><div class='annotation-tooltip'>"+annotation+"</div><span><i class='fas fa-plus-circle'></i></span></div></div></div>";
      block.innerHTML = block.innerHTML.replace("//:annotation:"+annotation, annotationTemplate);
    }
  }
}

// Generic Markers Annotation
function createMarkedAnnotations() {
  const markers = document.querySelectorAll('marker');
  if (markers == null) return

  for(let marker of markers) {
    let annotation = document.querySelector('.annotation-wrapper#'+marker.id);
    if (annotation == null) continue
    
    if (marker.id === annotation.id) {
      marker.innerHTML = annotation.outerHTML;
      annotation.remove();
    }
  };
}
