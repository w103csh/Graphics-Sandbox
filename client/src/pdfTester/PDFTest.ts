import {
  PDFJSStatic,
  PDFDocumentProxy,
  PDFPageProxy,
  PDFPageViewport,
} from 'pdfjs-dist';

const PDFJS: PDFJSStatic = require('pdfjs-dist');
PDFJS.workerSrc = require('pdfjs-dist/build/pdf.worker.entry');

export class PDFTest {
  private callback: Function;
  private parentScaleTo: string;
  private canvas: HTMLCanvasElement;

  constructor(canvasParent: HTMLElement, fileInput: HTMLInputElement, callback?: Function, parentScaleTo?: string) {
    let instance = this;

    // Set scaleTo (default to width)
    this.parentScaleTo = parentScaleTo === 'height' ? parentScaleTo : 'width';

    fileInput.onchange = function(this: HTMLInputElement, ev: Event) {
      PDFTest.handleFiles.call(this, ev, instance);
    }

    // Canvas
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
    // Fill parent by default
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    canvasParent.appendChild(this.canvas);

    this.callback = callback || new Function();
  }

  private static handleFiles(this: HTMLInputElement, ev: Event, instance: PDFTest) {
    // Setup file reader
    let fileReader = new FileReader();
    fileReader.onload = function(this: MSBaseReader, ev: Event) {
      PDFTest.pdfLoaded.call(this, ev, instance);
    }

    for (let i = 0; i < this.files.length; i++) {
      let file = this.files.item(i);
      fileReader.readAsArrayBuffer(file);
    }
  }

  private static pdfLoaded(this: MSBaseReader, ev: Event, instance: PDFTest) {
    let array = new Uint8Array(this.result);
    PDFJS.getDocument(array).then((doc: PDFDocumentProxy) => {
      console.log('PDF loaded');
      // TODO: loop through pages
      if (!doc.numPages) {
        console.log('No pages');
        return;
      }
      doc.getPage(1).then((page: PDFPageProxy) => {
        instance.pageLoaded.call(instance, page);
      });
    });
  }

  private pageLoaded(page: PDFPageProxy) {
    console.log('Page loaded');
  
    // Make sure canvas width and height are updated if percent css used.
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  
    // Get file's info
    let scale = 1;
    let viewport = page.getViewport(scale);
  
    let setScale = true;
  
    if (setScale) {
      // TODO: save original viewport information for the texture before
      // changing for scaled render below
  
      // Find scale for canvas
      let scaleToHeight = this.parentScaleTo === 'height';
      let dimensions = this.getDimensions(viewport, scaleToHeight);
  
      // Set new canvas dimension
  
      // This makes the image square to prevent distortion (doesn't work)
      // this.canvas.width = scaleToHeight ? dimensions.height : dimensions.width;
      // this.canvas.height = scaleToHeight ? dimensions.height : dimensions.width;
  
      // This makes it look nice
      this.canvas.width = dimensions.width;
      this.canvas.height = dimensions.height;
  
      let rect = [
        0,
        0,
        this.canvas.width,
        this.canvas.height
      ];
  
      // Set viewport to the largest size where the whole pdf is visible.
      viewport = page.getViewport(dimensions.scale);
      viewport.convertToViewportRectangle(rect);
    }
  
    page.render({
      canvasContext: this.canvas.getContext('2d'),
      viewport: viewport
    }).then(() => {
      this.pageRendered.call(this);
    });
  }

  private getDimensions(viewport: PDFPageViewport, scaleToHeight: boolean) {
    let width, height, scale;
  
    scale = scaleToHeight ?
      ( this.canvas.height / viewport.height ) :
      ( this.canvas.width / viewport.width );
  
    width = scale * viewport.width;
    height = scale * viewport.height;
  
    return { 
      scale: scale,
      width: width,
      height: height,
    };
  }

  private pageRendered(this: PDFTest) {
    console.log('Page rendered.');
    this.callback(this.canvas);
  }

} // class PDFTest
