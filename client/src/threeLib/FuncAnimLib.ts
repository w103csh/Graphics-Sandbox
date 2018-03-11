
import { AnimationClosure } from './index';

export namespace FuncAnimLib {

  // This is boned atm.
  export function rotateScene(this: AnimationClosure) {
    var notifyLength = true;
    var rotSoFar = 0;
  
    return function() {
      let now = Date.now() / 1000 ; // now in seconds
      this.start = this.start || now;
      let elapsed = now - this.start;
    
      if( elapsed <= this.animationLength ) {
        let rotPercent = this.animationRotation * ( elapsed / this.animationLength );
        let rot = rotPercent - rotSoFar; // only rotate the the amount percent since calc.
        rotSoFar = rotPercent;
        console.log(rot);
        this.camera.rotateZ( rot );
        this.camera.updateProjectionMatrix();
      }
      else if (notifyLength) {
        notifyLength = false;
        console.log(`elapsed: ${elapsed}`);
        debugger;
      }
    }
  }
  
  export function somethingElse(this: AnimationClosure) {
   // TODO: threeTest
  }
  
  // This was in threeTest
  export function unknownRotation(group: THREE.Group) {
    var time = Date.now() / 1000;
  
    for (var i = 0, l = group.children.length; i < l; i++) {
  
      var sprite = group.children[i] as THREE.Sprite;
      var material = sprite.material;
      var scale = Math.sin(time + sprite.position.x * 0.01) * 0.3 + 1.0;
  
      var imageWidth = 1;
      var imageHeight = 1;
  
      if (material.map && material.map.image && material.map.image.width) {
  
        imageWidth = material.map.image.width;
        imageHeight = material.map.image.height;
  
      }
  
      sprite.material.rotation += 0.1 * (i / l);
      sprite.scale.set(scale * imageWidth, scale * imageHeight, 1.0);

      // Guessed what mapC should be
      let mapC: THREE.Texture;
  
      if (material.map !== mapC) {
  
        material.opacity = Math.sin(time + sprite.position.x * 0.01) * 0.4 + 0.6;
  
      }

      group.rotation.x = time * 0.5;
      group.rotation.y = time * 0.75;
      group.rotation.z = time * 1.0;
    }
  }
}