import * as THREE from 'three';

import {
  THREEClosure,
  rotateScene
} from './index';

export class AnimationClosure extends THREEClosure {

  // test vars for animation
  private animations: Function[];
  private doAnimate: boolean;
  private start: number;
  private last: number;
  private animationLength: number;
  private animationRotation: number;
  private testAngle: number;
  
  constructor(canvasParent: HTMLElement, cameraPosition: THREE.Vector3, cameraLookAt: THREE.Vector3,
     animations: Function[]) {

    super(canvasParent, cameraPosition, cameraLookAt);

    this.animations = animations;
    this.doAnimate = true;
    this.start = null;
    this.last = null;
    this.animationLength = 5;
    this.animationRotation = null;
    this.testAngle = null;
  }

  init(setup: Function) {
    super.init(setup);
    this.animate();
  }

  animate(): void {
    window.requestAnimationFrame(this.animate);
    this.animations.forEach(animation => animation());
    this.renderer.render(this.scene, this.camera);
  }
}