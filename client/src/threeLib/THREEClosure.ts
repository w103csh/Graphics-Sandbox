import * as THREE from 'three';

import {
  ViewportDimensions
} from './index';

export class THREEClosure {

  // ******** Members ********
  private parent: HTMLElement;
  private canvas: HTMLCanvasElement;
  protected renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public maxDistance = 500000;
  // HUD
  public cameraOrtho: THREE.OrthographicCamera;
  public sceneOrtho: THREE.Scene;
  // Transforms
  public mouseSpaceToHUDSpace: (vector: THREE.Vector3) => THREE.Vector3;
  public cameraSpaceToHUDSpace: (vector: THREE.Vector3) => THREE.Vector3;
  public scaleToScreen: (x: number, y: number, scale: number) => THREE.Vector3;

  constructor(canvasParent: HTMLElement, camera: THREE.PerspectiveCamera) {
    this.parent = canvasParent;
    this.camera = camera;

    let dimensions = this.getCanvasDimensions();
    camera.aspect = dimensions.aspect;
    this.updateTransforms(dimensions);

    this.cameraOrtho = new THREE.OrthographicCamera(
      0,  // left
      1,  // right
      1,  // top
      0,  // bottom
      1,  // near
      10  // far
    );
    this.cameraOrtho.position.z = 10;

    // Scenes
    this.scene = new THREE.Scene();
    this.sceneOrtho = new THREE.Scene();
    // Canvas
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(dimensions.width, dimensions.height);
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.autoClear = false; // To allow render HUD overlay

    this.canvas = this.renderer.domElement;
    this.parent.appendChild(this.canvas);

    // Events
    window.addEventListener('resize', () => {
      this.onWindowResize.call(this);
    }, false);
  }

  init(setup: Function): void {
    setup.call(this);
    this.render();
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.sceneOrtho, this.cameraOrtho);
  }

  // TODO: C++
  private getCanvasDimensions(): ViewportDimensions  {
    let maxAspect = 16 / 9;

    let heightIsLargest = this.parent.clientHeight > this.parent.clientWidth;
    let sideMax = Math.max(this.parent.clientHeight, this.parent.clientWidth);
    let sideMin = Math.min(this.parent.clientHeight, this.parent.clientWidth);
    if ((sideMax / sideMin) > maxAspect) {
      sideMax = sideMin * maxAspect;
    }

    let height = heightIsLargest ? sideMax : sideMin;
    let width = heightIsLargest ? sideMin : sideMax;
    let dimensions = { 
      height: height,
      width: width,
      aspect: sideMax / sideMin
    };

    return dimensions;
  }

  private updateTransforms(dimensions: ViewportDimensions) {
    let width = dimensions.width;
    let height = dimensions.height;

    this.mouseSpaceToHUDSpace = (in_vec: THREE.Vector3) => {
      let out_vec = new THREE.Vector3();
      out_vec.x = (in_vec.x + 0.5) / dimensions.width;
      out_vec.y = (dimensions.height - in_vec.y + 0.5) / dimensions.height;
      out_vec.z = 1; // default HUD z-value
      return out_vec;
    }

    this.cameraSpaceToHUDSpace = (in_vec: THREE.Vector3) => {
      let out_vec = new THREE.Vector3();
      out_vec.x = (in_vec.x + 1) / 2;
      out_vec.y = (in_vec.y + 1) / 2;
      out_vec.z = 1; // default HUD z-value
      return out_vec;
    }

    this.scaleToScreen = (x: number, y: number, scale: number) => {
      let out_vec = new THREE.Vector3();
      out_vec.x = x / dimensions.width * scale;
      out_vec.y = y / dimensions.height * scale;
      out_vec.z = 1; // default HUD z-value
      return out_vec;
    }
  }

  private onWindowResize() {
    let dimensions = this.getCanvasDimensions();

    this.camera.aspect = dimensions.aspect;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(dimensions.width, dimensions.height);
  }

  public setMousedown(listener: EventListener) {
    this.canvas.onmousedown = listener;
  }

  public setMousemove(listener: EventListener) {
    this.canvas.onmousemove = listener;
  }
}