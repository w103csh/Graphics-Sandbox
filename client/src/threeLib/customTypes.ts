import * as THREE from 'three';

import {
  THREEClosure
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
  
  constructor(canvasParent: HTMLElement, camera: THREE.PerspectiveCamera, animations: Function[]) {
    super(canvasParent, camera);

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
    window.requestAnimationFrame(() => this.animate.call(this));
    this.animations.forEach(animation => animation());
    this.render();
  }
}

export interface ViewportDimensions {
  width: number;
  height: number;
  aspect: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}