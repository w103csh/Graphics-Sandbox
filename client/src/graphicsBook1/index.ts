import * as THREE from 'three';
import {
  THREEClosure,
  FuncLib
} from "../threeLib";

import 'styles/main.css';

export function addGraphicsBook1UI(parent: HTMLElement) {
  // Canvas parent
  let canvasParent = document.createElement('div') as HTMLDivElement;
  canvasParent.id = 'graphicsBook1Div';
  canvasParent.classList.add('canvas-parent-default', 'def-margin-bottom');
  parent.appendChild(canvasParent);

  let threeClosure = new THREEClosure(canvasParent, FuncLib.getDefaultPerspectiveCamera());

  threeClosure.init(() => {
    // X: RED || Y: GREEN || Z: BLUE
    let axes = FuncLib.getAxisLinesGeom(threeClosure.maxDistance);
    axes.forEach(axis => {
      threeClosure.scene.add(axis);
    });
  
    let workPlane = FuncLib.getWorkPlane(threeClosure.maxDistance);
    // scene.add(workPlane);

    FuncLib.simpleMathPractice(threeClosure.scene, threeClosure.camera, 3);
  });
}