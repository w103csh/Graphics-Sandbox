
import { AnimationClosure } from './index';

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