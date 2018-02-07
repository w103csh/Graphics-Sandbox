

var camera, scene, renderer, canvas;
var cameraOrtho, sceneOrtho;

var spriteTL, spriteTR, spriteBL, spriteBR, spriteC;

init();
animate();

function init() {
  var width = window.innerWidth;
  var height = window.innerHeight;

  camera = new THREE.PerspectiveCamera(60, width / height, 1, 2100);
  camera.position.z = 1500;

  cameraOrtho = new THREE.OrthographicCamera(- width / 2, width / 2, height / 2, - height / 2, 1, 10);
  cameraOrtho.position.z = 10;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1500, 2100);

  sceneOrtho = new THREE.Scene();

  let geometry = new THREE.IcosahedronGeometry(200, 1);
  let material = new THREE.MeshBasicMaterial({
    color: 0xfff999fff,
    wireframe: true,
    wireframeLinewidth: 8
  })
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // create sprites

  var amount = 200;
  var radius = 500;

  // SPRITES
  // for (let i = 0; i < 50; i++) {
  material = new THREE.SpriteMaterial({ color: Math.random() * 0xffffff });
  sprite = new THREE.Sprite(material);
  sprite.position.x = Math.random() * 1000 - 500;
  sprite.position.y = Math.random() * 1000 - 500;
  sprite.position.z = Math.random() * 1000 - 500;
  sprite.scale.set(64, 64, 1);
  scene.add(sprite);


  material = new THREE.SpriteMaterial({ color: Math.random() * 0xffffff });
  sprite = new THREE.Sprite(material);
  sprite.position.x = 20;
  sprite.position.y = 20;
  sprite.position.z = 0;
  sprite.scale.set(64, 64, 1);
  scene.add(sprite);
  // }

  var textureLoader = new THREE.TextureLoader();
  var mapA = textureLoader.load("images/circle.png", createInferenceSprites);

  // renderer

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false; // To allow render overlay on top of sprited sphere

  canvas = document.body.appendChild(renderer.domElement);
  canvas.onmousemove = canvasMousemove;
  canvas.onmouseup = canvasMouseup;

  //

  window.addEventListener('resize', onWindowResize, false);
}

function canvasMousemove(event) {
  // logMouseCoords(event);
}

function canvasMouseup(event) {
  logMouseCoords(event);
}

function logMouseCoords(event) {
  console.log(`(${event.x}, ${event.y})`);
}

function animate() {
  window.requestAnimationFrame(animate);

  mesh.rotation.x = Date.now() * 0.00005;
  mesh.rotation.y = Date.now() * 0.0001;
  mesh.position.y += 0.0005;
  mesh.position.z += 0.05;

  render();
}

function createInferenceSprites(texture) {

  var material = new THREE.SpriteMaterial({ map: texture });

  var width = material.map.image.width;
  var height = material.map.image.height;

  spriteTL = new THREE.Sprite(material);
  spriteTL.scale.set(width, height, 1);
  sceneOrtho.add(spriteTL);

  spriteTR = new THREE.Sprite(material);
  spriteTR.scale.set(width, height, 1);
  sceneOrtho.add(spriteTR);

  spriteBL = new THREE.Sprite(material);
  spriteBL.scale.set(width, height, 1);
  sceneOrtho.add(spriteBL);

  spriteBR = new THREE.Sprite(material);
  spriteBR.scale.set(width, height, 1);
  sceneOrtho.add(spriteBR);

  spriteC = new THREE.Sprite(material);
  spriteC.scale.set(width, height, 1);
  sceneOrtho.add(spriteC);

  updateHUDSprites();

}

function updateHUDSprites() {

  var width = window.innerWidth / 2;
  var height = window.innerHeight / 2;

  var material = spriteTL.material;

  var imageWidth = material.map.image.width / 2;
  var imageHeight = material.map.image.height / 2;

  spriteTL.position.set(- width + imageWidth, height - imageHeight, 1); // top left
  spriteTR.position.set(width - imageWidth, height - imageHeight, 1); // top right
  spriteBL.position.set(- width + imageWidth, - height + imageHeight, 1); // bottom left
  spriteBR.position.set(width - imageWidth, - height + imageHeight, 1); // bottom right
  spriteC.position.set(0, 0, 1); // center

  console.log(spriteTL.position);
  console.log(spriteTR.position);
  console.log(spriteBL.position);
  console.log(spriteBR.position);
  console.log(spriteC.position);
}

function onWindowResize() {

  var width = window.innerWidth;
  var height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  cameraOrtho.left = - width / 2;
  cameraOrtho.right = width / 2;
  cameraOrtho.top = height / 2;
  cameraOrtho.bottom = - height / 2;
  cameraOrtho.updateProjectionMatrix();

  updateHUDSprites();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function render() {

  var time = Date.now() / 1000;

  // for (var i = 0, l = group.children.length; i < l; i++) {

  //   var sprite = group.children[i];
  //   var material = sprite.material;
  //   var scale = Math.sin(time + sprite.position.x * 0.01) * 0.3 + 1.0;

  //   var imageWidth = 1;
  //   var imageHeight = 1;

  //   if (material.map && material.map.image && material.map.image.width) {

  //     imageWidth = material.map.image.width;
  //     imageHeight = material.map.image.height;

  //   }

  //   sprite.material.rotation += 0.1 * (i / l);
  //   sprite.scale.set(scale * imageWidth, scale * imageHeight, 1.0);

  //   if (material.map !== mapC) {

  //     material.opacity = Math.sin(time + sprite.position.x * 0.01) * 0.4 + 0.6;

  //   }

  // }

  // group.rotation.x = time * 0.5;
  // group.rotation.y = time * 0.75;
  // group.rotation.z = time * 1.0;

  renderer.clear();
  renderer.render(scene, camera);
  renderer.clearDepth();
  renderer.render(sceneOrtho, cameraOrtho);

}