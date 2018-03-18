// Assets
import 'styles/main.css';

import { addPdfTestDefaultUI } from './pdfTester';
import { addGraphicsBook1UI } from './graphicsBook1';
import { addHUDTesterUI } from './HUDTester';

// Header
let header = document.createElement('header') as HTMLElement;
header.id = 'header';
header.classList.add('def-margin-bottom');
document.body.appendChild(header);

// Main
let main = document.createElement('section') as HTMLElement;
main.id = 'main';
main.classList.add('def-margin-bottom');
document.body.appendChild(main);

// Main
let footer = document.createElement('footer') as HTMLElement;
footer.id = 'footer';
footer.classList.add('def-margin-bottom');
document.body.appendChild(footer);

// addPdfTestDefaultUI(header, footer);
addGraphicsBook1UI(main);
// addHUDTesterUI(main);