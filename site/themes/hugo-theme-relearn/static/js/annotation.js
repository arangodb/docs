const annotations = document.querySelectorAll(`annotation`);

annotations.forEach(element => {
  console.log(element.textContent);
});