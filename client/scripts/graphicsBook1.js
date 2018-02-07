var camera, scene, renderer;
init();
var animate = false;
animate && rotateScene();

function init() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
  );
  // X: RED || Y: GREEN || Z: BLUE
  // console.log(camera);
  camera.position.z = 150;
  camera.position.y = 90;
  camera.position.x = 80;
  
  // 45 deg = 0.785398 rad
  camera.rotation.x = -0.4;
  camera.rotation.y = 0.4;
  camera.rotation.z = 0.185;

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

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 1);
  !animate && renderer.render(scene, camera);

  document.body.appendChild(renderer.domElement);
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

function rotateScene() {
  window.requestAnimationFrame(rotateScene);
  //console.log(scene);
  scene.children.forEach((child) => {
    child.rotation.x = Date.now() * 0.00005;
    child.rotation.y = Date.now() * 0.0001;
    child.position.y += 0.0005;
    child.position.z += 0.05;
  });
  renderer.render(scene, camera);
}
