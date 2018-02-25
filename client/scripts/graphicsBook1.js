// globals
var camera, scene, renderer;

// test vars for animation
var animate = false;
var start = null;
var last = null;
var animationLength = 5;
var animationRotation = null;
var testAngle = null;

init();
animate && rotateScene();

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
  camera.position.set(60, 30, 50);
  camera.lookAt(0, 0, 0);

  scene = new THREE.Scene();

  // Hello World! mesh
  // scene.add(getHelloWorldMesh());

  let axes = getAxisLinesGeom();
  axes.forEach(axis => {
    scene.add(axis);
  });
  
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
  !animate && renderer.render(scene, camera);

  canvasParent.appendChild(renderer.domElement);
}

function getHelloWorldMesh() {
  let geometry = new THREE.IcosahedronGeometry(200, 1);
  let material = new THREE.MeshBasicMaterial({
    color: 0xfff999fff,
    wireframe: true,
    wireframeLinewidth: 8
  });
  return new THREE.Mesh(geometry, material);
}

function getAxisVector(axis, direction) {
  //console.log(axis);
  max = 500000*direction;
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

var notifyLength = true;
var rotSoFar = 0;
function rotateScene() {
  window.requestAnimationFrame(rotateScene);

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

  renderer.render(scene, camera);
}
