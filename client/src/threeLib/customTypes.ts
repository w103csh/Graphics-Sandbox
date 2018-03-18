import * as THREE from 'three';

import {
  THREEClosure
} from './index';

export class AnimationClosure extends THREEClosure {

  // Renderer
  public composer: THREE.EffectComposer;

  // test vars for animation
  private animations: Function[];
  private doAnimate: boolean;
  private start: number;
  private last: number;
  private animationLength: number;
  private animationRotation: number;
  private testAngle: number;

  constructor(canvasParent: HTMLElement, camera: THREE.PerspectiveCamera, animations?: Function[], background?: string) {
    super(canvasParent, camera);

    // // Renderer
    // this.composer = new THREE.EffectComposer(this.renderer);

    // this.setupPasses(background);

    this.animations = animations || [];
    this.doAnimate = true;
    this.start = null;
    this.last = null;
    this.animationLength = 5;
    this.animationRotation = null;
    this.testAngle = null;

  }

  init(setup: Function, registerEvents?: Function) {
    super.init(setup, registerEvents);
    this.animate();
  }

  animate(): void {
    window.requestAnimationFrame(() => this.animate.call(this));
    this.animations.forEach(animation => animation());
    this.render();
  }

  // private setupPasses(background: string) {
  //   // Clear pass
  //   let pass = new THREE.RenderPass(this.scene, this.camera);
  //   this.composer.addPass(clearPass);

  //   if(background) {
  //     let pass = new THREE.RenderPass(this.scene, this.camera);
  //     pass.env
  //     this.composer.addPass(clearPass);
  //   }
  // }
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