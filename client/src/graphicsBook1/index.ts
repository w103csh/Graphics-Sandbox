import * as THREE from 'three';
import {
  THREEClosure,
  FuncLib
} from "../threeHelpers";

import 'styles/main.css';

export function addGraphicsBook1UI(parent: HTMLElement) {

  // File input
  let canvasParent = document.createElement('div') as HTMLDivElement;
  canvasParent.id = 'graphicsBook1Div';
  canvasParent.classList.add('canvas-def-height', 'def-margin-bottom');
  parent.appendChild(canvasParent);

  let threeClosure = new THREEClosure(
    canvasParent,
    new THREE.Vector3(50, 30, 50),
    new THREE.Vector3(0, 0, 0)
  );

  threeClosure.init(() => {

    let axes = FuncLib.getAxisLinesGeom(threeClosure.maxDistance);

    axes.forEach(axis => {
      threeClosure.scene.add(axis);
    });
  
    let workPlane = FuncLib.getWorkPlane(threeClosure.maxDistance);
    // scene.add(workPlane);

    FuncLib.simpleMathPractice(threeClosure.scene, threeClosure.camera, 3);
  });
}