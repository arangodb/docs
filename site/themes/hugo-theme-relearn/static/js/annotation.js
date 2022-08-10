//const codeBlocks = document.querySelectorAll(`code`);
//var regex = /\/\/marker.*/g;
/*
codeBlocks.forEach(codeBlock => {
  let markers = codeBlock.innerText.match(regex);
  console.log(markers);

  markers.forEach(marker => {
    let markerId = marker.split(':')[1].replace(/['" ]+/g, '')
    const annotation = document.querySelector('#'+markerId)
    console.log(annotation)

    codeBlock.innerHTML = codeBlock.innerHTML.replace(regex, annotation.outerHTML);
  })
})
*/

const markers = document.querySelectorAll('marker');
console.log("markers "+ markers)
markers.forEach(marker => {
  console.log("found marker id " + marker.id);
  let annotation = document.querySelector('.annotation-wrapper#'+marker.id);
  console.log(annotation);
  if (marker.id === annotation.id) {
    marker.innerHTML = annotation.outerHTML;
    
  }

  annotation.remove();
});
