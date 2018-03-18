import * as THREE from 'three';
import {
  THREEClosure,
  FuncLib,
  Object3D,
  AnimationClosure,
  BackgroundCubes,
  Events
} from "../threeLib";

import 'styles/main.css';

export function addGraphicsBook1UI(parent: HTMLElement) {
  // Canvas parent
  let canvasParent = document.createElement('div') as HTMLDivElement;
  canvasParent.id = 'graphicsBook1Div';
  canvasParent.classList.add('canvas-parent-default', 'def-margin-bottom');
  parent.appendChild(canvasParent);

  /**
   * ANIMATIONS
   */

  /**
   * CLOSURE
   */
  let animationClosure = new AnimationClosure(canvasParent, FuncLib.getDefaultPerspectiveCamera(), [], 'oldCity');

  /**
   * SETUP
   */
  let setup = function(this: THREEClosure) {
    // X: RED || Y: GREEN || Z: BLUE
    let axes = FuncLib.getAxisLinesGeom(this.maxDistance);
    axes.forEach(axis => {
      this.scene.add(axis);
    });

    // ****************************
    BackgroundCubes.setBackground('oldCity', this.scene);

    let workPlane = Object3D.getWorkPlane(this.maxDistance);
    this.scene.add(workPlane);

    FuncLib.simpleMathPractice(this.scene, this.camera, 3);
  };

  /**
   * REGISTER EVENTS
   */
  let registerEvents = function(this: THREEClosure) {
    let camera = this.camera;

    // Track input
    Events.trackMouseInput(
      this.canvas,
      undefined, // mousedown
      undefined, // mouseup
      function(this: HTMLElement, ev: KeyboardEvent) {
        Events.Handlers.look.call(this, ev, camera);
        Events.Handlers.pan.call(this, ev, camera);
      },         // mousemove
    );
    Events.trackKeyboardInput(
      document,
      function(this: HTMLElement, ev: KeyboardEvent) {
        Events.Handlers.move.call(this, ev, camera);
      },         // keydown
      undefined  // keyup
    );

    // Other handlers
    this.canvas.oncontextmenu = function(this: HTMLElement, ev: PointerEvent) {
        ev.preventDefault();
    };
  };

  animationClosure.init(setup, registerEvents);
}