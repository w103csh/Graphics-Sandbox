// globals
var camera, scene, renderer, canvas;
var pdfTest = new PDFTest('pdfTest', 'header', createPdfTextureGraphicsBook1, 'width');
var maxDistance = 500000;

// test vars for animation
var doAnimate = true;
var start = null;
var last = null;
var animationLength = 5;
var animationRotation = null;
var testAngle = null;

init();
doAnimate && animate();

function init() {
  let canvasParent = document.getElementById('graphicsBook1');
  let aspect = canvasParent.clientWidth / canvasParent.clientHeight;

  camera = new THREE.PerspectiveCamera(
    60, // fov
    aspect, // aspect
    0.1, //
    10000 //
  );
  // X: RED || Y: GREEN || Z: BLUE
  // console.log(camera);
  camera.position.set(50, 30, 50);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  let axes = getAxisLinesGeom();
  axes.forEach(axis => {
    scene.add(axis);
  });

  let workPlane = getWorkPlane();
  scene.add(workPlane);
  
  // let a = getRandomLineGeom();
  // scene.add(a);
  // let ua = getUnitVectorLineGeom(a, false);
  // scene.add(ua);
  // console.log(a.geometry);
  // console.log(ua.geometry);

  // renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(canvasParent.devicePixelRatio);
  renderer.setSize(canvasParent.clientWidth, canvasParent.clientHeight);
  renderer.setClearColor(0x000000, 1);
  // Single render if not ticking
  !doAnimate && renderer.render(scene, camera);

  canvas = renderer.domElement;
  canvasParent.appendChild(canvas);
}

function getAxisVector(axis, direction) {
  //console.log(axis);
  max = maxDistance * direction;
  let x = axis === "X" ? max : 0;
  let y = axis === "Y" ? max : 0;
  let z = axis === "Z" ? max : 0;
  return new THREE.Vector3(x, y, z);
}

function getAxisLinesGeom() {
  let axisLines = [];
  ["X", "Y", "Z"].forEach(axis => {
    // ColorLines
    let material, geometry;
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
    geometry = makeGeom(getAxisVector(axis, -1), getAxisVector(axis, 1));
    axisLines.push(new THREE.Line(geometry, material));
  });
  return axisLines;
}

function getRandomVector() {
  let max = 50;
  let x1 = Math.floor(Math.random() * max + 1) - max / 2;
  //console.debug("x1: " + x1);
  let x2 = Math.floor(Math.random() * max + 1) - max / 2;
  //console.debug("x2: " + x2);
  let x3 = Math.floor(Math.random() * max + 1) - max / 2;
  //console.debug("x3: " + x3);
  return new THREE.Vector3(x1, x2, x3);
}

function getRandomLineGeom(color) {
  let material = new THREE.LineBasicMaterial({ color: color || 0xffffff });
  return new THREE.Line(makeGeom(getRandomVector(), getRandomVector()), material);
}

function getUnitVectorLineGeom(line) {
  let material = new THREE.LineBasicMaterial({color:0xff0000});
  let geomCopy = new THREE.Geometry().copy(line.geometry);
  let unit = new THREE.Vector3().subVectors(geomCopy.vertices[1], geomCopy.vertices[0]).normalize();
  geomCopy.vertices[1] = new THREE.Vector3().addVectors(geomCopy.vertices[0], unit);
  return new THREE.Line(makeGeom.apply(null, geomCopy.vertices), material);
}

function makeGeom() {
  var geometry = new THREE.Geometry();
  var args = Array.from(arguments);
  args.forEach(arg => {
    geometry.vertices.push(arg);
  });
  return geometry;
}

function getWorkPlane() {
  let scale = 1;

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

  let plane = new THREE.Mesh( geometry, material );
  plane.name = 'workPlane';
  plane.rotateX( Math.PI / 2 );

  return plane;
}

function createPDFRect(material) {
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
  let relWidth = ( material.map.image.width / material.map.image.height ) * baseSize;
  let relHeight = ( material.map.image.height / material.map.image.width ) * baseSize;
  let geometry = new THREE.BoxBufferGeometry( relWidth, 2, relHeight );

  let rectMesh = new THREE.Mesh(geometry, material);
  rectMesh.name = 'PDFRect';

  scene.add(rectMesh); 
}

function createPdfTextureGraphicsBook1(texture) {
  console.log('PDF is now a texture. WTF! GB');

  // Test image quality
  let div = document.createElement('div');
  let header = document.createElement('h3');
  header.textContent = 'Image quality test';
  div.appendChild(header);
  let img = document.createElement('img');
  img.src = texture.image.currentSrc;
  div.appendChild(img);
  document.body.appendChild(div);
  
  let material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  createPDFRect(material);
}

function animate() {
  window.requestAnimationFrame(animate);

  // rotateScene();
  
  renderer.render(scene, camera);
}

// Animation functions

// This is boned atm.
var rotateScene = function() {
  var notifyLength = true;
  var rotSoFar = 0;

  return function() {
    let now = Date.now() / 1000 ; // now in seconds
    start = start || now;
    let elapsed = now - start;
  
    if( elapsed <= animationLength ) {
      let rotPercent = animationRotation * ( elapsed / animationLength );
      let rot = rotPercent - rotSoFar; // only rotate the the amount percent since calc.
      rotSoFar = rotPercent;
      console.log(rot);
      camera.rotateZ( rot );
      camera.updateProjectionMatrix();
    }
    else if (notifyLength) {
      notifyLength = false;
      console.log(`elapsed: ${elapsed}`);
      debugger;
    }
  }
}
