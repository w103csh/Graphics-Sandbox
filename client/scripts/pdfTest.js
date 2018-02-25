const min_canvasWidth = 700;
const min_canvasHeight = 550;

var textureLoader = new THREE.TextureLoader();

// Header
let header = document.getElementById('header');
// File input
let fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.onchange = handleFiles;
header.appendChild(fileInput);

// Main
let main = document.getElementById('main');
// Canvas
var canvas = document.createElement('canvas');
canvas.style.width = '100%';
canvas.style.height = '100%';
main.appendChild(canvas);

var arrayBuffer;
var fileReader = new FileReader();
fileReader.onload = pdfLoaded;

var array = null;

function handleFiles() {
  for (let i = 0; i < this.files.length; i++) {
    let file = this.files.item(i);
    fileReader.readAsArrayBuffer(file);
  }
}

function pdfLoaded() {
  array = new Uint8Array(this.result);
  let loadingTask = PDFJS.getDocument(array);
  loadingTask.promise.then((pdf) => {
    console.log('PDF loaded');

    if (!pdf.numPages) {
      console.log('No pages');
      return;
    }

    pdf.getPage(1).then(function (page) {
      console.log('Page loaded');

      // Make sure canvas width and height are updated.
      canvas.width = Math.max(canvas.clientWidth, min_canvasWidth);
      canvas.height = canvas.clientHeight = Math.max(canvas.clientHeight, min_canvasHeight);

      let scale = 1;
      let viewport = page.getViewport(scale);

      let setScale = true;

      if (setScale) {
        // Find scale for canvas size
        let w_prop = canvas.width / viewport.width;
        let h_prop = canvas.height / viewport.height;
        scale = Math.min(w_prop, h_prop);

        rect = [0, 0, canvas.width, canvas.height];

        // Set viewport to the largest size where the whole pdf is visible.
        viewport = page.getViewport(scale);
        viewport.convertToViewportRectangle(rect);
      }

      var renderTask = page.render({
        canvasContext: canvas.getContext('2d'),
        viewport: viewport
      });

      renderTask.then(function () {
        console.log('Page rendered.');
        let image = canvas.toDataURL();
        textureLoader.load(image, createPdfTexture);
      });
    });

  });
}

function createPdfTexture(texture) {
  console.log('PDF is now a texture. WTF!');
  console.log(texture);
}