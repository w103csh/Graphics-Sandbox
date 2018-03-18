import * as THREE from 'three';
import * as _ from 'lodash';

import { CurrentInput } from './currentInput';
import { FuncLib } from '..';
const _currInputinstance: CurrentInput = CurrentInput.instance;

export namespace Events {

  export enum MouseButton {
    Left = 0,
    Middle,
    Right
  }
  export enum KeyboardKey {
    W = 87,
    A = 65,
    S = 83,
    D = 68,
  }
  export enum KeyboardModifier {
    Alt = 0,
    Shift,
    Ctrl
  }

  export class InputCombination {
    public keys: Events.KeyboardKey[];
    public keyModifiers: Events.KeyboardModifier[];
    public buttons: Events.MouseButton[];
    constructor(
      keys: Events.KeyboardKey[],
      keyModifiers: Events.KeyboardModifier[],
      buttons: Events.MouseButton[]
    ) {
      this.keys = keys || [];
      this.keyModifiers = keyModifiers || [];
      this.buttons = buttons || [];
    }
  }

  // Combinations (not sure where to put these yet)
  const _lookInputCombo = new InputCombination(
    [],
    [],
    [MouseButton.Right]
  );
  const _panInputCombo = new InputCombination(
    [],
    [], //[KeyboardModifier.Ctrl],
    [MouseButton.Middle]
  );
  const _moveInputCombo = new InputCombination(
    [Events.KeyboardKey.W, Events.KeyboardKey.A, Events.KeyboardKey.S, Events.KeyboardKey.D],
    [],
    []
  );

  export function trackMouseInput(element: HTMLElement, mousedownHandler?: Function, mouseupHandler?: Function, mousemoveHandler?: Function) {

    // Mousedown
    element.onmousedown = function (this: HTMLElement, ev: MouseEvent) {
      CurrentInput.instance.pushButtons(ev.button);
      mousedownHandler && mousedownHandler.call(this, ev); // handlers
      CurrentInput.instance.lastMouseEvent = ev; // store the last
    }

    // Mouseup
    element.onmouseup = function (this: HTMLElement, ev: MouseEvent) {
      CurrentInput.instance.lastMouseEvent = null; // clear the last
      CurrentInput.instance.popButtons(ev.button);
      mouseupHandler && mouseupHandler.call(this, ev); // handlers
    }

    // Mousemove
    element.onmousemove = function (this: HTMLElement, ev: MouseEvent) {
      mousemoveHandler && mousemoveHandler.call(this, ev); // handlers
      CurrentInput.instance.lastMouseEvent = ev.buttons ? ev : null; // store/clear on buttons
    }

  }

  export function trackKeyboardInput(document: Document, keydownHandler?: Function, keyupHandler?: Function) {

    // Keydown
    document.onkeydown = function (this: Document, ev: KeyboardEvent) {
      CurrentInput.instance.lastKeyboardEvent = ev; // save the last (probably not needed)
      // KeyCode
      CurrentInput.instance.pushKeys(ev.keyCode);
      // Modifiers
      ev.altKey && CurrentInput.instance.pushKeyModifiers(Events.KeyboardModifier.Alt);
      ev.ctrlKey && CurrentInput.instance.pushKeyModifiers(Events.KeyboardModifier.Ctrl);
      ev.shiftKey && CurrentInput.instance.pushKeyModifiers(Events.KeyboardModifier.Shift);

      keydownHandler && keydownHandler.call(this, ev); // call anything passed in
    }

    // Keyup
    document.onkeyup = function (this: Document, ev: KeyboardEvent) {
      // KeyCode
      CurrentInput.instance.popKeys(ev.keyCode);
      // Modifiers
      !ev.altKey && CurrentInput.instance.popKeyModifiers(Events.KeyboardModifier.Alt);
      !ev.ctrlKey && CurrentInput.instance.popKeyModifiers(Events.KeyboardModifier.Ctrl);
      !ev.shiftKey && CurrentInput.instance.popKeyModifiers(Events.KeyboardModifier.Shift);

      keyupHandler && keyupHandler.call(this, ev); // call anything passed in
    }

  }

  export function checkCurrentInputAll(inputCombo: InputCombination) {
    return _.xor(CurrentInput.instance.keys, inputCombo.keys).length === 0 &&
      _.xor(CurrentInput.instance.keyModifiers, inputCombo.keyModifiers).length === 0 &&
      _.xor(CurrentInput.instance.buttons, inputCombo.buttons).length === 0
  }

  export namespace Handlers {

    /**
     * Move the camera based on an increment. This movment will not affect up/down.
     * 
     * @export
     * @param {Document} this The webpage document (not used)
     * @param {KeyboardEvent} ev The keyboard event fired for this handle (not used)
     * @param {THREE.Camera} camera The main perspective camera
     * @param {number} scale A scale for how fractional the camera rotations should be
     */
    export function move(this: Document, ev: KeyboardEvent, camera: THREE.Camera, scale?: number) {

      let right = 0;
      let left = 0;
      let forward = 0;
      let back = 0;

      CurrentInput.instance.keys.forEach(key => {
        switch(key) {
          case Events.KeyboardKey.W: forward = 1; break;
          case Events.KeyboardKey.A: left = 1; break;
          case Events.KeyboardKey.S: back = 1; break;
          case Events.KeyboardKey.D: right = 1; break;
        }
      });

      // Some net changed
      if ((right ^ left) | (forward ^ back)) {

        scale = scale || 2.0;
        let movement = new THREE.Vector3();

        // Perpendicular movement
        if (right ^ left) {
          let perp = new THREE.Vector3();
          perp.crossVectors(camera.getWorldDirection(), camera.up);
          left && perp.multiplyScalar(-1);
          perp.normalize();
          movement.add(perp);
        }
  
        // Parallel movement
        if (forward ^ back) {
          let para =  camera.getWorldDirection().clone();
          back && para.multiplyScalar(-1);
          movement.add(para);
        }
  
        movement.normalize()
        scale && movement.multiplyScalar(scale);
        camera.position.add(movement);
      }

    }

    export function look(this: HTMLCanvasElement, ev: MouseEvent, camera: THREE.PerspectiveCamera, scale?: number) {
      if (_.xor(CurrentInput.instance.buttons, _lookInputCombo.buttons).length === 0 && 
        CurrentInput.instance.lastMouseEvent) {

        // Set some focal point 50 units in front of camera direction
        let newFocalPoint = new THREE.Vector3();
        newFocalPoint.copy(camera.getWorldPosition());
        newFocalPoint.addScaledVector(camera.getWorldDirection(), 50);

        // TODO : Account for camera up not being a good starting point

        // Get x basis vector for camera direction
        let xBasis = new THREE.Vector3();
        xBasis.crossVectors(camera.getWorldDirection(), camera.up);
        xBasis.normalize();

        // Get y basis based on camera direction and xBasis
        let yBasis = new THREE.Vector3()
        yBasis.crossVectors(camera.getWorldDirection(), xBasis);
        yBasis.normalize();

        scale = scale || 3.0;
        let x = ev.x - CurrentInput.instance.lastMouseEvent.x;
        let y = ev.y - CurrentInput.instance.lastMouseEvent.y;

        // Move focal point based on mouse movement
        xBasis.multiplyScalar(x / scale);
        newFocalPoint.add(xBasis);
        yBasis.multiplyScalar(y / scale);
        newFocalPoint.add(yBasis);
        
        // Construct a new bases based on the new focal point. (I couldn't get things to rotate flatly in firstTryLook)
        camera.lookAt(newFocalPoint);

      }
    }

    export function firstTryLook(this: HTMLCanvasElement, ev: MouseEvent, camera: THREE.PerspectiveCamera, scale?: number) {

      if (_.xor(CurrentInput.instance.buttons, _lookInputCombo.buttons).length === 0 && 
        CurrentInput.instance.lastMouseEvent) {

        scale = scale || 325; // 325 is some arbitrary number that felt good.

        let x = CurrentInput.instance.lastMouseEvent.x - ev.x;
        let y = CurrentInput.instance.lastMouseEvent.y - ev.y;

        if (y) { // pitch
          let pitch = y * Math.PI / (scale / camera.aspect); // account for aspect
          camera.rotateX(pitch);
          camera.updateMatrixWorld(true);
        }

        if (x) { // yaw
          let yaw = x * Math.PI / scale;
          
          let yFlatDir = camera.getWorldDirection().clone();
          yFlatDir.y = 0;
          
          let xAngleToFlat = camera.getWorldDirection().angleTo(yFlatDir);
          console.log(xAngleToFlat);
          camera.rotateX(xAngleToFlat); // rotate around x to flat

          camera.rotateY(yaw); // rotate yaw amount
          camera.rotateX(-xAngleToFlat); // rotate back to original pitch
          camera.updateMatrixWorld(true);
        }

        // // Correct for z cause its annoying me.
        // let roll = x * Math.PI / scale;
          
        // let zFlatDir = camera.getWorldDirection().clone();
        // zFlatDir.z = 0;
        
        // let zAngleToFlat = camera.getWorldDirection().angleTo(zFlatDir);
        // console.log(zAngleToFlat);
        // camera.rotateZ(zAngleToFlat); // rotate around z to flat

      }
    }

    export function pan(this: HTMLCanvasElement, ev: MouseEvent) {
      if (checkCurrentInputAll(_panInputCombo)) {
        console.log('Pan!');
      }
    }

  } // namespace Handlers

} // namespace Events