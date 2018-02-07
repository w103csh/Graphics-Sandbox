

var camera, scene, renderer;
var geometry, material, mesh;
init();
// animation();

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 500;

  scene = new THREE.Scene();

  geometry = new THREE.IcosahedronGeometry(200, 1);
  material = new THREE.MeshBasicMaterial({
    color: 0xfff999fff,
    wireframe: true,
    wireframeLinewidth: 8
  })
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  renderer.render(scene, camera);
}

// function animation() {
//   window.requestAnimationFrame(animation);

//   mesh.rotation.x = Date.now() * 0.00005;
//   mesh.rotation.y = Date.now() * 0.0001;
//   mesh.position.y += 0.0005;
//   mesh.position.z += 0.05;

//   renderer.render(scene, camera);
// }