// Assets
import 'styles/main.css';

import { addPdfTestDefaultUI } from './pdfTester';
import { addGraphicsBook1UI } from './graphicsBook1';
import { addHUDTesterUI } from './HUDTester';
import { SpaceEx, CommitPromiseResult } from './quantumClientEx';

// // Header
// let header = document.createElement('header') as HTMLElement;
// header.id = 'header';
// header.classList.add('def-margin-bottom');
// document.body.appendChild(header);

// // Main
// let main = document.createElement('section') as HTMLElement;
// main.id = 'main';
// main.classList.add('def-margin-bottom');
// document.body.appendChild(main);

// // Main
// let footer = document.createElement('footer') as HTMLElement;
// footer.id = 'footer';
// footer.classList.add('def-margin-bottom');
// document.body.appendChild(footer);

// // addPdfTestDefaultUI(header, footer);
// addGraphicsBook1UI(main);
// // addHUDTesterUI(main);

let space = new SpaceEx();

space.addComponent('x');
space.addEntity('a', 'b', 'c', 1, 6000);
space.addEntity(1, 2, 3, 2, 3000);
space.addRelationship(1, 2);

console.log(`Pending commits: ${space.pendingCommits.length}`);

let maxRetries = 1;
let callback = (...args: any[]) => {}; // Callback from something


space.waitForCommits(maxRetries).then((message: string) => {

  console.log(`\n*** waitForCommits SUCCEEDED!\n\n`);

  console.log(message);
  console.log(`\nPending commits: ${space.pendingCommits.length}\n`);

  callback('I succeeded!');

}).catch((resultsJSON: string) => {

  console.log(`\n*** waitForCommits FAILED!\n\n`);

  let results = JSON.parse(resultsJSON);
  results.forEach((result: CommitPromiseResult) => {
    console.log(`Commit operation "${result.map.operation}" with id ${result.map.id} failed with errors:\n${result.map.errors.join('\n')}`)
  });
  console.log(`\nPending commits: ${space.pendingCommits.length}\n`);

  callback('I failed!');
});
