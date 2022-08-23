renderVersion();

// Generic Markers Annotation

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
  