// Assets
import circleImg from 'images/sprites/circle.png';
import redballonImg from 'images/sprites/redballon.png';
import starImg from 'images/sprites/star.png';
import 'styles/main.css';

import * as THREE from 'three';
import {
  AnimationClosure,
  FuncLib
} from "../threeLib";

export function addHUDTesterUI(parent: HTMLElement) {
  // Canvas parent
  let canvasParent = document.createElement('div') as HTMLDivElement;
  canvasParent.id = 'HUDTesterDiv';
  canvasParent.classList.add('canvas-parent-default', 'def-margin-bottom');
  parent.appendChild(canvasParent);  

  // Globals (TODO: Change this. Probably need some kind of DI)
  let circleSprite: THREE.Sprite, starSprite: THREE.Sprite, redballonSprite: THREE.Sprite;
  let mesh: THREE.Mesh, geometry: THREE.Geometry;
  let randomInt: number, amount: number, radius: number;
  let textureLoader = new THREE.TextureLoader();

  let animate = function(this: AnimationClosure) {
    mesh.rotation.x = Date.now() * 0.00005;
    mesh.rotation.y = Date.now() * 0.0001;
    // mesh.position.y += 0.0005;
    // mesh.position.z += 0.05;

    let randomVector = geometry.vertices[randomInt].clone();
    randomVector.applyMatrix4(mesh.matrix);

    if(starSprite) {
      starSprite.position.copy(randomVector);
    }
  }

  let camera = FuncLib.getDefaultPerspectiveCamera(false);
  camera.position.set(0, 0, 400);

  let animationClosure = new AnimationClosure(canvasParent, camera, [ animate ]);

  animationClosure.init(() => {

    geometry = new THREE.IcosahedronGeometry(200, 1);
    let material = new THREE.MeshBasicMaterial({
      color: 0xfff999fff,
      wireframe: true,
      wireframeLinewidth: 8
    })
    mesh = new THREE.Mesh(geometry, material);
    animationClosure.scene.add(mesh);
    
    randomInt = 0;
    amount = 200;
    radius = 500;

    // Load sprites
    textureLoader.load(circleImg, (texture: THREE.Texture) => {
      circleSprite = FuncLib.createSprite(texture, 'circle', undefined, animationClosure.scaleToScreen);
    });
    textureLoader.load(starImg, (texture: THREE.Texture) => {
      starSprite = FuncLib.createSprite(texture, 'start', animationClosure.scene);
    });
    textureLoader.load(redballonImg, (texture: THREE.Texture) => {
      redballonSprite = FuncLib.createSprite(texture, 'redballon', undefined, animationClosure.scaleToScreen);
    });

    randomInt = FuncLib.getRandomInt(geometry.vertices.length);
    
    // Events (TODO: use implicit this for these so that the param list doesn't get crazy)
    animationClosure.setMousedown((ev: MouseEvent) => {
      canvasMousedown1(
        ev,
        starSprite,
        redballonSprite,
        circleSprite,
        animationClosure.camera,
        animationClosure.cameraSpaceToHUDSpace,
        animationClosure.mouseSpaceToHUDSpace,
        animationClosure.sceneOrtho,
        animationClosure.scene
      );
    });
    animationClosure.setMousemove((ev: Event) => {
      canvasMousemove1(ev);
    });
  });

}

// TODO: this is all terrible
function canvasMousedown1(
  ev: MouseEvent,
  star: THREE.Sprite,
  ballon: THREE.Sprite,
  circle: THREE.Sprite,
  camera: THREE.Camera,
  cameraSpaceToHUDSpace: Function,
  mouseSpaceToHUDSpace: Function,
  sceneOrtho: THREE.Scene,
  scene: THREE.Scene
) {
  let mouseCoords = FuncLib.getMouseEventScreenCoords(ev);
  FuncLib.logCoords(mouseCoords, 'mousedown');

  let vector = FuncLib.getHUDVectorFromWorldVector(star.position, camera, cameraSpaceToHUDSpace)
  FuncLib.logCoords(vector, 'getHUDVectorFromWorldVector');
  ballon.position.copy(vector);
  sceneOrtho.add(ballon);

  vector = mouseSpaceToHUDSpace(mouseCoords);
  FuncLib.logCoords(vector, 'mouseSpaceToHUDSpace');
  circle.position.copy(vector);
  sceneOrtho.add(circle);
}

function canvasMousemove1(ev: Event) {
  // logCoords(event, 'mousemove');
  // let mouse = new THREE.Vector3( event.x, event.y, 1 );
  // circleSprite.position.copy(mouse.applyMatrix4(TRANSF_mouseToHUD1));
}