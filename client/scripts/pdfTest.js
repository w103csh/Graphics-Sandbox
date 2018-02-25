var PDFTest = (function PDFTestClosure() {

  var __instance = null;
  var __callback = null;
  var __fileReader = new FileReader();

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
    }
  }

  // Private functions

  function pdfLoaded() {
    let array = new Uint8Array(this.result);
    let loadingTask = PDFJS.getDocument(array);
    loadingTask.promise.then((pdf) => {
      console.log('PDF loaded');

      // TODO: loop through pages
      if (!pdf.numPages) {
        console.log('No pages');
        return;
      }
      pdf.getPage(1).then(pageLoaded);

    });
  }

  function handleFiles() {
    for (let i = 0; i < this.files.length; i++) {
      let file = this.files.item(i);
      __fileReader.readAsArrayBuffer(file);
    }
  }

  function pageLoaded(page) {
    console.log('Page loaded');

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

  function pageRendered() {
    console.log('Page rendered.');
    let image = __instance._canvas.toDataURL();
    _textureLoader.load(image, __callback);
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

  return PDFTest;
})();