import * as THREE from 'three';

import {
  THREEClosure
} from './index';

export namespace FuncLib {

  export function simpleMathPractice(scene: THREE.Scene, camera: THREE.Camera, count: number) {
    for (let step = 0; step < count; step++) {
      let l = getRandomLine();
      scene.add(l);

      let unitVectorTest = false;
      if (unitVectorTest) {
        let ul = getUnitVectorLine(l.geometry as THREE.Geometry, '0xa52a2a');
        scene.add(ul);
      }

      let orthoTest = true;
      if (orthoTest) {
        let geometry = l.geometry.clone() as THREE.Geometry;
        getOthonormalBasis(
          scene,
          geometry.vertices[0],
          geometry.vertices[1],
          camera.up
        );
      }
    }
  }

  export function getOthonormalBasis(scene: THREE.Scene, eye: THREE.Vector3, target: THREE.Vector3, up: THREE.Vector3) {
    let xMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    let yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    let zMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });

    let z = new THREE.Vector3().subVectors(eye, target);
    z.normalize();

    let x = new THREE.Vector3().crossVectors(z, up);
    x.normalize();

    let y = new THREE.Vector3().crossVectors(x, z);
    y.normalize();

    let geometry = new THREE.Geometry();
    geometry.vertices.push(
      eye,
      new THREE.Vector3().addVectors(eye, x)
    );
    let line = new THREE.Line(geometry, xMaterial);
    scene.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(
      eye,
      new THREE.Vector3().addVectors(eye, y)
    );
    line = new THREE.Line(geometry, yMaterial);
    scene.add(line);

    geometry = new THREE.Geometry();
    geometry.vertices.push(
      eye,
      new THREE.Vector3().addVectors(eye, z)
    );
    line = new THREE.Line(geometry, zMaterial);
    scene.add(line);
  }

  export function getAxisVector(maxDistance: number, axis: string, direction: number): THREE.Vector3 {
    //console.log(axis);
    let max = maxDistance * direction;
    let x = axis === "X" ? max : 0;
    let y = axis === "Y" ? max : 0;
    let z = axis === "Z" ? max : 0;
    return new THREE.Vector3(x, y, z);
  }

  export function getAxisLinesGeom(maxDistance: number) {
    let axisLines: THREE.Line[] = [];
    ["X", "Y", "Z"].forEach(axis => {
      // ColorLines
      let material: THREE.LineBasicMaterial;
      switch (axis) {
        case "X":
          material = new THREE.LineBasicMaterial({ color: 0xff0000 });
          break;
        case "Y":
          material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
          break;
        case "Z":
          material = new THREE.LineBasicMaterial({ color: 0x0000ff });
          break;
      }
      let geometry = makeGeometry(getAxisVector(maxDistance, axis, -1), getAxisVector(maxDistance, axis, 1));
      axisLines.push(new THREE.Line(geometry, material));
    });
    return axisLines;
  }

  export function getRandomVector(): THREE.Vector3 {
    let max = 50;
    let x = Math.floor(Math.random() * max + 1) - max / 2;
    let y = Math.floor(Math.random() * max + 1) - max / 2;
    let z = Math.floor(Math.random() * max + 1) - max / 2;
    let vector = new THREE.Vector3(x, y, z);
    return vector;
  }

  export function getRandomLine(color?: THREE.Color): THREE.Line {
    let material = new THREE.LineBasicMaterial({
      color: color || 0xffa500
    });
    return new THREE.Line(makeGeometry(
      getRandomVector(),
      getRandomVector()
    ), material);
  }

  export function getUnitVectorLine(geometry: THREE.Geometry, color: string) {
    let material = new THREE.LineBasicMaterial({
      color: color || 0x00000
    });

    // I guess just use [0] as origin
    let p1 = geometry.vertices[0].clone();
    let unit = new THREE.Vector3().subVectors(
      p1,
      geometry.vertices[1]
    ).normalize();

    let p2 = p1.clone().add(unit);

    return new THREE.Line(makeGeometry(p1, p2), material);
  }

  export function makeGeometry(...vectors: THREE.Vector3[]) {
    var geometry = new THREE.Geometry();
    vectors.forEach(vector => {
      geometry.vertices.push(vector);
    });
    return geometry;
  }

  export function getWorkPlane(maxDistance: number): THREE.Mesh {
    let scale = 0.001;

    let geometry = new THREE.PlaneGeometry(
      maxDistance * scale, // width
      maxDistance * scale, // height
      16 // width segments
      // height segements
    );

    let material = new THREE.MeshBasicMaterial({
      color: 0xb0b0b0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });

    let plane = new THREE.Mesh(geometry, material);
    plane.name = 'workPlane';
    plane.rotateX(Math.PI / 2);

    return plane;
  }

  export function createPDFRect(scene: THREE.Scene, material: THREE.SpriteMaterial) {
    // // Get image dimension info
    // let scale = 1;
    // let w_half = ( material.map.image.width  / 2 ) * scale;
    // let h_half = ( material.map.image.height / 2 ) * scale;

    // let rectGeom = new THREE.Geometry();
    // // These are y up hardcoded for now
    // rectGeom.vertices.push(new THREE.Vector3( - w_half, 0.0, - h_half )); 
    // rectGeom.vertices.push(new THREE.Vector3(   w_half, 0.0,   h_half )); 
    // rectGeom.vertices.push(new THREE.Vector3( - w_half, 0.0,   h_half )); 
    // rectGeom.vertices.push(new THREE.Vector3(   w_half, 0.0, - h_half )); 
    // rectGeom.faces.push(new THREE.Face3(0, 1, 2));
    // rectGeom.faces.push(new THREE.Face3(0, 2, 3));

    // Just make a box for now.
    let baseSize = 50;
    let relWidth = (material.map.image.width / material.map.image.height) * baseSize;
    let relHeight = (material.map.image.height / material.map.image.width) * baseSize;
    let geometry = new THREE.BoxBufferGeometry(relWidth, 2, relHeight);

    let rectMesh = new THREE.Mesh(geometry, material);
    rectMesh.name = 'PDFRect';

    scene.add(rectMesh);
  }

  export function createPdfTextureGraphicsBook1(this: THREEClosure, canvas: HTMLCanvasElement) {

    // // Test image quality
    // let div = document.createElement('div');
    // let header = document.createElement('h3');
    // header.textContent = 'Image quality test';
    // div.appendChild(header);
    // let img = document.createElement('img');
    // img.src = texture.image.currentSrc;
    // div.appendChild(img);
    // document.body.appendChild(div);

    let texture = new THREE.CanvasTexture(canvas);

    console.log('PDF is now a texture. WTF! GB');

    let material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    createPDFRect.call(this, material);
  }

}