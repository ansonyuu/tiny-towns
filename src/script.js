import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Perlin } from "three-noise";
import GUI from "lil-gui";

// Debug
const gui = new GUI();
const settings = {
  near: 2,
  color: 0xffff00
};
const extrusionSettings = {
  steps: 1,
  bevelEnabled: false,
  bevelThickness: 0,
  bevelSize: 0,
  bevelOffset: 5,
  bevelSegments: 0
};
const color = gui
  .addColor(settings, "color")
  .listen()
  .onChange((x) => {
    plane.material.color.setHex(x);
  });

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
export const scene = new THREE.Scene();

const planeGeometry = new THREE.PlaneGeometry(15, 15, 15, 15);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: settings.color,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.material.color.setHex(0xff9a00);
scene.add(plane);

const perlin = new Perlin(Math.random());

for (let x = 0; x <= 1000; x += 10) {
  let x1 = x;
  let x2 = x + 10;

  for (let y = 0; y <= 1000; y += 10) {
    let y1 = y;
    let y2 = y + 10;
    const buildingPoints = [];

    x1 += THREE.MathUtils.randFloat(-2, 2);
    y1 += THREE.MathUtils.randFloat(-2, 2);

    buildingPoints.push(new THREE.Vector2(x1, y1));
    buildingPoints.push(new THREE.Vector2(x2, y1));
    buildingPoints.push(new THREE.Vector2(x2, y2));
    buildingPoints.push(new THREE.Vector2(x1, y2));

    const buildingShape = new THREE.Shape(buildingPoints);
    const sampleRate = 0.02;
    extrusionSettings.depth =
      ((perlin.get2(new THREE.Vector2(x1 * sampleRate, y1 * sampleRate)) + 1) /
        2) *
      100;

    const buildingGeometry = new THREE.ExtrudeGeometry(
      buildingShape,
      extrusionSettings
    );

    const materialFront = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const materialSide = new THREE.MeshBasicMaterial({ color: 0xff8800 });
    const materialArray = [materialFront, materialSide];
    const buildingMaterial = new THREE.MeshNormalMaterial(materialArray);

    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(-500, -500, 0);
    scene.add(building);
  }
}

// Lights
const pointLight = new THREE.PointLight(0xffffff, 0.1);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  135,
  sizes.width / sizes.height,
  90,
  10000
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

controls.minDistance = 100;
controls.maxDistance = 5000;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x92d5f2, 1);

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Orbital Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
