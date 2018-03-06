var PDFTest = (function PDFTestClosure() {

  var __instance = null;
  var __callback = null;
  var __fileReader = new FileReader();
  var DEFAULT_SCALE = 1.5;

  class PDFTest {
    constructor(parentId, inputId, callback, parentScaleTo) {
      // Input
      let header = document.getElementById(inputId);
      // Parent
      let parent = document.getElementById(parentId);
      // Set scaleTo (default to width)
      this._parentScaleTo = parentScaleTo === 'height' ? parentScaleTo : 'width';

      // File input
      let fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.onchange = handleFiles;
      header.appendChild(fileInput);
    
      // Canvas
      this._canvas = document.createElement('canvas');
      // Fill parent by default
      this._canvas.style.width = '100%';
      this._canvas.style.height = '100%';
      parent.appendChild(this._canvas);

      __fileReader.onload = pdfLoaded;

      // Expose pdf rendered so that it can be overridden.
      // TODO: change callback thing
      this.pageLoaded = pageLoaded;

      // Set __instance to this. I couldn't think of a better way but I am sure there is one.
      __instance = this;
      __callback = callback;

      // Promise.all([System.import('pdfjs/display/api'),
      //   System.import('pdfjs/display/svg'),
      //   System.import('pdfjs/display/global'),
      //   System.import('pdfjs/display/worker_options'),
      //   System.import('pdfjs/display/network'),
      //   System.resolve('pdfjs/worker_loader')])
      // .then(function (modules) {
      //   var api = modules[0];
      //   var svg = modules[1];
      //   var global = modules[2];
      //   var GlobalWorkerOptions = modules[3].GlobalWorkerOptions;
      //   var network = modules[4];
      //   api.setPDFNetworkStreamFactory((params) => {
      //     return new network.PDFNetworkStream(params);
      //   });

      //   // In production, change this to point to the built `pdf.worker.js` file.
      //   GlobalWorkerOptions.workerSrc = modules[5];

      //   // In production, change this to point to where the cMaps are placed.
      //   global.PDFJS.cMapUrl = '../../external/bcmaps/';
      //   global.PDFJS.cMapPacked = true;

      //   // Fetch the PDF document from the URL using promises.
      //   api.getDocument(url).then(function (doc) {
      //     renderDocument(doc, svg);
      //   });
      // });
    }
  }

  // Private functions

  function handleFiles() {
    for (let i = 0; i < this.files.length; i++) {
      let file = this.files.item(i);
      __fileReader.readAsArrayBuffer(file);
    }
  }

  function pdfLoaded() {
    let array = new Uint8Array(this.result);
    PDFJS.getDocument(array).then((doc) => {
      console.log('PDF loaded');

      // TODO: loop through pages
      if (!doc.numPages) {
        console.log('No pages');
        return;
      }
      doc.getPage(1).then(pageLoaded);
    });
  }

  function pageLoaded(page) {
    console.log('Page loaded');

    page.getOperatorList().then(parseOpList);

    // Make sure canvas width and height are updated if percent css used.
    __instance._canvas.width = __instance._canvas.clientWidth;
    __instance._canvas.height = __instance._canvas.clientHeight;

    // Get file's info
    let scale = 1;
    let viewport = page.getViewport(scale);

    let setScale = true;

    if (setScale) {
      // TODO: save original viewport information for the texture before
      // changing for scaled render below

      // Find scale for canvas
      let scaleToHeight = __instance._parentScaleTo === 'height';
      let dimensions = getDimensions(viewport, scaleToHeight);

      // Set new canvas dimension

      // This makes the image square to prevent distortion (doesn't work)
      // __instance._canvas.width = scaleToHeight ? dimensions.height : dimensions.width;
      // __instance._canvas.height = scaleToHeight ? dimensions.height : dimensions.width;

      // This makes it look nice
      __instance._canvas.height = dimensions.width;
      __instance._canvas.height = dimensions.height;

      let rect = [
        0,
        0,
        __instance._canvas.width,
        __instance._canvas.height
      ];

      // Set viewport to the largest size where the whole pdf is visible.
      viewport = page.getViewport(dimensions.scale);
      viewport.convertToViewportRectangle(rect);
    }

    var renderTask = page.render({
      canvasContext: __instance._canvas.getContext('2d'),
      viewport: viewport
    });

    renderTask.then(pageRendered);
  }

  function parseOpList(opList) {
    console.log(opList);
    let ops = new Set(opList.fnArray);
    let opsNames = [];
    ops.forEach((op) => {
      opsNames.push(getKeyByValue(PDFJS.OPS, op));
    });
    // opList.fnArray.forEach((fn, index) => {
    //   if(fn == PDFJS.OPS.lineTo) {
    //     console.log('tear');
    //     lines.push(opList.argsArray[index]);
    //   }
    // });
  }

  function pageRendered() {
    console.log('Page rendered.');
    __callback(__instance._canvas);
  }

  function getDimensions(viewport, scaleToHeight) {
    let width, height, scale;

    scale = scaleToHeight ?
      ( __instance._canvas.height / viewport.height ) :
      ( __instance._canvas.width / viewport.width );

    width = scale * viewport.width;
    height = scale * viewport.height;

    return { 
      scale: scale,
      width: width,
      height: height,
    };
  }

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }

  return PDFTest;
})();