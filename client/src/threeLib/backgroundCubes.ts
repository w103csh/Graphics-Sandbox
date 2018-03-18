import * as THREE from 'three';

import nx from 'images/cubes/oldCity/nx.png';
import ny from 'images/cubes/oldCity/ny.png';
import nz from 'images/cubes/oldCity/nz.png';
import px from 'images/cubes/oldCity/px.png';
import py from 'images/cubes/oldCity/py.png';
import pz from 'images/cubes/oldCity/pz.png';

export namespace BackgroundCubes {

  export function setBackground(backgound: string, scene: THREE.Scene) {
    switch(backgound) {
      case 'oldCity': 
        let imgs = [nx, ny, nz, px, py, pz];
        new THREE.CubeTextureLoader().load(imgs, function (cubeTexture) {
          scene.background = cubeTexture;
        });
        break;
      default: break;
    }
  }

} 