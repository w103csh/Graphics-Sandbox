import * as THREE from 'three';

export class THREEClosure {

  // ******** Members ********
  private canvas: HTMLCanvasElement;
  protected renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public scene: THREE.Scene;
  public maxDistance = 500000;

  constructor(canvasParent: HTMLElement, cameraPosition: THREE.Vector3, cameraLookAt: THREE.Vector3) {

    let aspect = canvasParent.clientWidth / canvasParent.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      60,     // fov
      aspect, // aspect
      20,     // near
      10000   // far
    );

    // X: RED || Y: GREEN || Z: BLUE
    // console.log(camera);
    cameraPosition = cameraPosition || new THREE.Vector3(50, 30, 50);
    this.camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    cameraLookAt = cameraLookAt || new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(cameraLookAt);

    // Scene
    this.scene =  new THREE.Scene();
    // Canvas
    this.canvas = document.createElement('canvas') as HTMLCanvasElement;
  
    // renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight);
    this.renderer.setClearColor(0x000000, 1);
    // Single render if not ticking
  
    this.canvas = this.renderer.domElement;
    canvasParent.appendChild(this.canvas);
  }

  init(setup: Function): void {

    setup.call(this);
    
    this.renderer.render(this.scene, this.camera);
  }
}