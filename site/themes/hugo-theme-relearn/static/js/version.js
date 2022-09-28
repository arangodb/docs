getCurrentVersion();
renderVersion();

function changeVersion() {
  var version = localStorage.getItem('docs-version');
  var versionSelector = document.getElementById("arangodb-version");
  version  = versionSelector.options[versionSelector.selectedIndex].value;
  localStorage.setItem('docs-version', version);
  versionSelector.options[versionSelector.options.selectedIndex].selected = true;
  location.reload();
}

function getCurrentVersion() {
  var version = localStorage.getItem('docs-version');
  var versionSelector = document.getElementById("arangodb-version");
  for(let option of versionSelector.options) {
    if (option.value == version) {
      option.selected = true;
    }
  }
}


function renderVersion() {
    const versionBlocks = document.querySelectorAll('.version');
    if (versionBlocks == null) return
  
    for(let block of versionBlocks) {
        const blockVersion = parseInt(block.classList[1]);
        var version = parseInt(localStorage.getItem('docs-version'));

        if (version >= blockVersion) {
            block.style.display = "block";
        }
      }
    };
  