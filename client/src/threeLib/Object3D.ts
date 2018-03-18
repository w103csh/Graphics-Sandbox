import * as THREE from "three";

export namespace Object3D {

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

} // namespace Object3D
