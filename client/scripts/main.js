

var camera, scene, renderer, canvas;
var cameraOrtho, sceneOrtho;

var circleSprite, starSprite, redballonSprite;
var mesh;
var randomInt = 0;

var width, height;

// TRANSFORMS
var TRANSF_mouseToHUD1 = new THREE.Matrix4();
var TRANSF_mouseToHUD2 = new THREE.Matrix4();
var TRANSF_worldToHUD1 = new THREE.Matrix4();
var TRANSF_worldToHUD2 = new THREE.Matrix4();
var TRANSF_viewToHUD = new THREE.Matrix4();

init();
animate();

function init() {

  updateComputedGeometry();

  camera = new THREE.PerspectiveCamera(
    70,             // fov
    width / height, // aspect
    1,              // near
    1000            // far
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 400;

  cameraOrtho = new THREE.OrthographicCamera(
    - width / 2,   // left
    width / 2,     // right
    height / 2,    // top
    - height / 2,  // bottom
    1,             // near
    10             // far
  );
  cameraOrtho.position.z = 10;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 1500, 2100);

  sceneOrtho = new THREE.Scene();

  // Geometry

  let geometry = new THREE.IcosahedronGeometry(200, 1);
  let material = new THREE.MeshBasicMaterial({
    color: 0xfff999fff,
    wireframe: true,
    wireframeLinewidth: 8
  })
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  randomInt = getRandomInt(mesh.geometry.vertices.length);

  // var box = new THREE.Box3();
  // box.setFromCenterAndSize(
  //   new THREE.Vector3( -1, 1, 1 ),
  //   new THREE.Vector3( -1, -1, 1 )
  // );

  // var helper = new THREE.Box3Helper( box, 0xffff00 );
  // scene.add( helper );

  // create sprites

  var amount = 200;
  var radius = 500;

  var textureLoader = new THREE.TextureLoader();
  textureLoader.load("images/circle.png", createCircleSprite);
  textureLoader.load("images/star.png", createStarSprite);
  textureLoader.load("images/redballon.png", createRedballonSprite);

  // renderer

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false; // To allow render overlay on top of sprited sphere

  canvas = document.body.appendChild(renderer.domElement);
  canvas.onmousemove = canvasMousemove;
  canvas.onmousedown = canvasMousedown;

  window.addEventListener('resize', onWindowResize, false);
}

function updateComputedGeometry() {
  width = window.innerWidth;
  height = window.innerHeight;

  // TRANSFORMS
  // ortho x : (width / 2) to (- width / 2) | y : (height / 2) to (- height / 2)
  TRANSF_mouseSpaceToHUDSpace.set(
    1,  0,  0, - width  / 2,
    0, -1,  0,   height / 2,
    0,  0,  0,            1,
    0,  0,  0,            1
  );
  // // ortho x : 1 to - 1 | y : 1 to - 1
  // TRANSF_mouseToHUD2.set(
  //   (1 / (-  width / 2)),                     0,  0,  0,
  //                      0,  (1 / (  height / 2)),  0,  0,
  //                      0,                     0,  1,  0,
  //                      0,                     0,  0,  1
  // );
  // ortho x : (width / 2) to (- width / 2) | y : (height / 2) to (- height / 2)
  // TRANSF_worldToHUD1.set(
  //   1,  0,  0, - width  / 2,
  //   0, -1,  0,   height / 2,
  //   0,  0,  0,            1,
  //   0,  0,  0,            1
  // );
  // ortho x : 1 to - 1 | y : 1 to - 1
  // TRANSF_worldToHUD2.set(
  //   1,  0,  0, - width  / 2,
  //   0, -1,  0,   height / 2,
  //   0,  0,  1,            0,
  //   0,  0,  0,            1
  // );
  TRANSF_cameraSpaceToHUDSpace.set(
    width / 2,           0,  0,  0,
            0,  height / 2,  0,  0,
            0,           0,  0,  1,
            0,           0,  0,  1
  );
}

function canvasMousemove(event) {
  // logCoords(event, 'mousemove');
  // let mouse = new THREE.Vector3( event.x, event.y, 1 );
  // circleSprite.position.copy(mouse.applyMatrix4(TRANSF_mouseToHUD1));
}

function canvasMousedown(event) {
  logCoords(event, 'mousedown');
  let HUDVecotr = new THREE.Vector3();

  HUDVector = getHUDVectorFromWorldVector(starSprite.position, camera)
  redballonSprite.position.copy(HUDVector);

  sceneOrtho.add(redballonSprite);
}

function getHUDVectorFromWorldVector(vector, camera) {
  let HUDVector = vector.clone();

  camera.worldToLocal(HUDVector);
  HUDVector.applyMatrix4(camera.projectionMatrix);
  
  HUDVector.applyMatrix4(TRANSF_viewToHUD);

  return HUDVector;
}

function logCoords(obj, name) {
  console.log(`${name}: (${obj.x}, ${obj.y}, ${obj.z})`);
}

function animate() {
  window.requestAnimationFrame(animate);

  mesh.rotation.x = Date.now() * 0.00005;
  mesh.rotation.y = Date.now() * 0.0001;
  // mesh.position.y += 0.0005;
  // mesh.position.z += 0.05;

  var randomVector = mesh.geometry.vertices[randomInt].clone();
  randomVector.applyMatrix4(mesh.matrix);

  if(starSprite) {
    starSprite.position.copy(randomVector);
  }

  render();
}

function createCircleSprite(texture) {
  var material = new THREE.SpriteMaterial({ map: texture });

  var width = material.map.image.width;
  var height = material.map.image.height;

  circleSprite = new THREE.Sprite(material);
  circleSprite.scale.set(width * 0.3, height * 0.3, 1);
  // sceneOrtho.add(circleSprite);

  // This is how to copy the sprite. Just save the material from this 
  // step.
  //
  // spriteC = new THREE.Sprite(material);
  // spriteC.scale.set(width, height, 1);
  // sceneOrtho.add(spriteC);
}

function createStarSprite(texture) {
  var material = new THREE.SpriteMaterial({ map: texture });

  var width = material.map.image.width;
  var height = material.map.image.height;

  starSprite = new THREE.Sprite(material);
  starSprite.scale.set(width * 0.1, height * 0.1, 1);
  scene.add(starSprite);
}

function createRedballonSprite(texture) {
  var material = new THREE.SpriteMaterial({ map: texture });

  var width = material.map.image.width;
  var height = material.map.image.height;

  redballonSprite = new THREE.Sprite(material);
  redballonSprite.scale.set(width * 0.1, height * 0.1, 1);
  // redballonSprite.position.set(0, 0, 1);
  // sceneOrtho.add(redballonSprite);
}

function onWindowResize() {
  updateComputedGeometry();

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  cameraOrtho.left = - width / 2;
  cameraOrtho.right = width / 2;
  cameraOrtho.top = height / 2;
  cameraOrtho.bottom = - height / 2;
  cameraOrtho.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
  //thing();

  renderer.clear();
  renderer.render(scene, camera);
  renderer.clearDepth();
  renderer.render(sceneOrtho, cameraOrtho);

}

function thing() {
  var time = Date.now() / 1000;

  for (var i = 0, l = group.children.length; i < l; i++) {

    var sprite = group.children[i];
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

    if (material.map !== mapC) {

      material.opacity = Math.sin(time + sprite.position.x * 0.01) * 0.4 + 0.6;

    }

  }

  group.rotation.x = time * 0.5;
  group.rotation.y = time * 0.75;
  group.rotation.z = time * 1.0;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}