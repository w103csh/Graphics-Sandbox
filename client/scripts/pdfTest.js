
const min_pdfCanvasWidth = 700;
const min_pdfCanvasHeight = 550;

// the this object is boned

class pdfTest {
  constructor() {
    // Header
    let header = document.getElementById('header');
    // File input
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = this.handleFiles;
    header.appendChild(fileInput);
  
    // pdfTest
    let pdfTest = document.getElementById('pdfTest');
    // Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    pdfTest.appendChild(this.canvas);

    this.fileReader = new FileReader();
    this.fileReader.onload = this.pdfLoaded;
  }

  handleFiles() {
    for (let i = 0; i < this.files.length; i++) {
      let file = this.files.item(i);
      _pdfTest.fileReader.readAsArrayBuffer(file);
    }
  }

  pdfLoaded() {
    let array = new Uint8Array(this.result);
    let loadingTask = PDFJS.getDocument(array);
    loadingTask.promise.then((pdf) => {
      console.log('PDF loaded');

      if (!pdf.numPages) {
        console.log('No pages');
        return;
      }
      pdf.getPage(1).then(_pdfTest.pageLoaded);

    });
  }

  pageLoaded(page) {
    console.log('Page loaded');

    // Make sure _pdfTest.canvas width and height are updated.
    _pdfTest.canvas.width = Math.max(_pdfTest.canvas.clientWidth, min_pdfCanvasWidth);
    _pdfTest.canvas.height = Math.max(_pdfTest.canvas.clientHeight, min_pdfCanvasHeight);

    let scale = 1;
    let viewport = page.getViewport(scale);

    let setScale = true;

    if (setScale) {
      // Find scale for _pdfTest.canvas size
      let w_prop = _pdfTest.canvas.width / viewport.width;
      let h_prop = _pdfTest.canvas.height / viewport.height;
      scale = Math.min(w_prop, h_prop);

      let rect = [0, 0, _pdfTest.canvas.width, _pdfTest.canvas.height];

      // Set viewport to the largest size where the whole pdf is visible.
      viewport = page.getViewport(scale);
      viewport.convertToViewportRectangle(rect);
    }

    var renderTask = page.render({
      canvasContext: _pdfTest.canvas.getContext('2d'),
      viewport: viewport
    });

    renderTask.then(_pdfTest.pageRendered);
  }

  pageRendered() {
    console.log('Page rendered.');
    let image = _pdfTest.canvas.toDataURL();
    _textureLoader.load(image, createPdfTexture);
  }

}

var _pdfTest = new pdfTest();