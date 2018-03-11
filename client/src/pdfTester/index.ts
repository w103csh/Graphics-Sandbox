import { PDFTest } from './PDFTest';

export function addPdfTestDefaultUI(inputParent: HTMLElement, canvasParent: HTMLElement) {
  // File input
  let fileInput = document.createElement('input') as HTMLInputElement;
  fileInput.type = 'file';
  inputParent.appendChild(fileInput);

  var pdfDiv = document.createElement('div') as HTMLDivElement;
  pdfDiv.id = 'pdfDiv';
  canvasParent.classList.add('def-margin-bottom');
  canvasParent.appendChild(pdfDiv);

  // Add file input
  let pdfTest = new PDFTest(pdfDiv, fileInput);
}

// Re-export
export { PDFTest } from './PDFTest';